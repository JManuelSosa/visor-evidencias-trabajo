/**
 * Mock de usePresignedUrl para pruebas locales sin red real.
 * Diseñado para ser un reemplazo directo (drop-in) del composable real.
 * 
 * Simula la latencia de red y la generación de URLs firmadas por Laravel.
 */

interface MockPresignedUrlConfig {
    /** Latencia simulada de la red en ms. Default: 300ms */
    delayMs: number;
    /** 
     * Status HTTP simulado para forzar un error del backend. 
     * undefined = siempre exitoso.
     * Ej: 400 (datos inválidos), 403 (contexto no permitido), 500 (error de servidor).
     */
    failStatus?: number;
    /** Mensaje de error simulado que devolvería Laravel en el JSON */
    failMessage?: string;
}

let mockFileIdCounter = 1000; // Simula IDs autoincrementales de la BD

let config: MockPresignedUrlConfig = {
    delayMs: 300,
};

/**
 * Permite ajustar el comportamiento del mock desde el test/escenario.
 * Ej: configureMockPresignedUrl({ failStatus: 403, failMessage: 'Contexto no permitido' })
 */
export function configureMockPresignedUrl(overrides: Partial<MockPresignedUrlConfig>): void {
    config = { ...config, ...overrides };
}

/** Vuelve el mock a su comportamiento por defecto (siempre exitoso). */
export function resetMockPresignedUrlConfig(): void {
    config = { delayMs: 300 };
    mockFileIdCounter = 1000; // Reiniciar contador para pruebas deterministas
}

/**
 * Simula la obtención de una URL firmada desde Laravel.
 */
export async function getPresignedUrl(
    filename: string,
    mimeType: string,
    sizeBytes: number,
    context: string
): Promise<{ file_id: number; upload_url: string; headers: Record<string, string> }> {
    
    // 1. Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, config.delayMs));

    // 2. Simular errores de validación del backend (Laravel)
    if (config.failStatus) {
        const error: any = new Error(config.failMessage || 'Error simulado del backend');
        error.response = {
            status: config.failStatus,
            data: { 
                message: config.failMessage || `Simulated Laravel error ${config.failStatus}` 
            }
        };
        throw error;
    }

    // 3. Camino exitoso: Simular respuesta de Laravel
    const fileId = mockFileIdCounter++;
    
    return {
        file_id: fileId,
        // URL ficticia que el mock de R2 ignorará, pero que sirve para debugging
        upload_url: `https://mock-r2-account.r2.cloudflarestorage.com/${context}/${fileId}/${encodeURIComponent(filename)}`,
        headers: {
            'Content-Type': mimeType,
            'x-amz-acl': 'public-read', // Ejemplo de header que R2 podría esperar
        }
    };
}

/**
 * Wrapper para mantener la misma firma de composable que el original
 */
export function usePresignedUrl() {
    return {
        getPresignedUrl
    };
}