/**
 * Mock de uploadToR2 para pruebas locales sin red real.
 * Misma firma exacta que la versión real -> reemplazo directo (drop-in).
 *
 * Simula el progreso emitiendo onProgress cada `progressIntervalMs`,
 * con una duración total estimada según el tamaño del archivo y una
 * "velocidad" configurable, acotada entre un piso y un techo para que
 * ni un archivo de 2KB "suba" instantáneo ni uno de 1GB tarde minutos reales.
 */

interface MockUploadConfig {
    /** Velocidad simulada en MB/s. Default: 20 (500MB ≈ 25s, 1GB ≈ 50s antes del techo). */
    simulatedSpeedMBps: number;
    /** Duración mínima en ms, para que archivos chicos igual muestren progreso. */
    minDurationMs: number;
    /** Duración máxima en ms, para no esperar minutos en pruebas con archivos grandes. */
    maxDurationMs: number;
    /** Cada cuánto se emite un tick de progreso. */
    progressIntervalMs: number;
    /**
     * Porcentaje (0-100) en el que se debe simular un fallo. undefined = siempre exitoso.
     * Útil para probar el flujo de error/retry sin depender de condiciones reales.
     */
    failAt?: number;
    /** Status HTTP simulado en el error (default 500). Usa 403 para probar tu mensaje de URL expirada. */
    failStatus?: number;
}

let config: MockUploadConfig = {
    simulatedSpeedMBps: 20,
    minDurationMs: 600,
    maxDurationMs: 30000,
    progressIntervalMs: 150,
};

/**
 * Permite ajustar el comportamiento del mock desde el test/escenario que lo use,
 * sin tener que tocar esta función. Ej: configureMockUpload({ failAt: 60, failStatus: 403 })
 */
export function configureMockUpload(overrides: Partial<MockUploadConfig>): void {
    config = { ...config, ...overrides };
}

/** Vuelve el mock a su comportamiento por defecto (siempre exitoso, sin fallos simulados). */
export function resetMockUploadConfig(): void {
    config = {
        simulatedSpeedMBps: 20,
        minDurationMs: 600,
        maxDurationMs: 30000,
        progressIntervalMs: 150,
    };
}

export async function uploadToR2(
    file: File,
    uploadUrl: string,
    headers: Record<string, string>,
    signal: AbortSignal,
    onProgress?: (loaded: number, total: number) => void
): Promise<void> {

    // uploadUrl/headers no se usan (no hay request real), se mantienen por firma para ser drop-in.
    void uploadUrl;
    void headers;

    return new Promise((resolve, reject) => {

        if (signal.aborted) {
            reject(new Error('UPLOAD_CANCELED'));
            return;
        }

        const speedBytesPerMs = (config.simulatedSpeedMBps * 1024 * 1024) / 1000;
        const rawDurationMs = file.size / speedBytesPerMs;
        const totalDurationMs = Math.min(Math.max(rawDurationMs, config.minDurationMs), config.maxDurationMs);

        const failAtBytes = config.failAt !== undefined
            ? Math.floor(file.size * (config.failAt / 100))
            : null;

        const startedAt = Date.now();
        let settled = false;

        function cleanup(): void {
            clearInterval(intervalId);
            signal.removeEventListener('abort', onAbort);
        }

        function onAbort(): void {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('UPLOAD_CANCELED'));
        }

        signal.addEventListener('abort', onAbort);

        const intervalId = setInterval(() => {

            if (settled) return;

            const elapsed = Date.now() - startedAt;
            const ratio = Math.min(elapsed / totalDurationMs, 1);
            const loaded = Math.floor(file.size * ratio);

            if (failAtBytes !== null && loaded >= failAtBytes) {
                settled = true;
                cleanup();

                const simulatedError: any = new Error('Simulated upload failure');
                simulatedError.response = {
                    status: config.failStatus ?? 500,
                    data: { message: 'Error simulado (mock uploadToR2)' }
                };

                reject(simulatedError);
                return;
            }

            if (onProgress) onProgress(loaded, file.size);

            if (ratio >= 1) {
                settled = true;
                cleanup();
                resolve();
            }

        }, config.progressIntervalMs);
    });
}
