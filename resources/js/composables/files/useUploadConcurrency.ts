import type { ContextType } from "@/core/files/ContextType";

/**
 * Representa un trabajo de subida en la cola.
 * La función `execute` encapsula toda la lógica real de subida,
 * manteniendo el composable desacoplado de:
 * - FileUploader (servicio de subida)
 * - useUploadTracker (estado reactivo)
 * - useUploadEvents (sistema de eventos)
 */

export interface UploadJob {
    uploadId:string;
    file:File;
    context:ContextType;
    execute: () => Promise<void>;
}

/**
 * Singleton que gestiona la cola global de subidas y el worker pool.
 *
 * Responsabilidad única:
 * - Mantener la cola FIFO de trabajos pendientes.
 * - Ejecutar workers respetando el límite de concurrencia GLOBAL.
 * - Permitir reencolar trabajos (reintentos) que pasen por la cola.
 *
 * No gestiona:
 * - Estado reactivo
 * - Eventos
 * - Logica de subida real.
 */

// Estado interno no reactivo (Lógica de scheduling)
let concurrencyLimit = 3;
let activeWorkers = 0;
const queue:UploadJob[] = [];

/**
 * Agrega un trabajo a la cola y dispara workers si hay capacidad.
 */
function enqueue(job:UploadJob):void {
    queue.push(job);
    processQueue();
}

/**
 * Remueve un trabajo específico de la cola por su uploadId.
 * Útil cuando se cancela un upload que aún no ha empezado a ejecutarse.
 * @param uploadId - ID del upload a remover de la cola
 * @returns true si se encontró y removió, false si no estaba en la cola
 */
function dequeue(uploadId:string):boolean {
    const index = queue.findIndex((job) => job.uploadId === uploadId);
    if(index !== -1){
        queue.splice(index, 1);
        return true;
    }

    return false;
}

/**
 * Reencola un trabajo al inicio de la cola (prioridad para reintentos)
 */
function enqueuePriority(job:UploadJob):void {
    queue.unshift(job);
    processQueue();
}

/**
 * Procesa la cola mientras haya capacidad y trabajos pendientes.
 */
function processQueue():void {
    while(activeWorkers < concurrencyLimit && queue.length > 0) {
        const job = queue.shift();
        if(!job) break;

        activeWorkers++;
        executeJob(job);
    }
}

/**
 * Ejecuta un trabajo individual y libera el slot al terminar.
 */
async function executeJob(job:UploadJob):Promise<void> {

    try {
        await job.execute();
    }
    catch (error) {
        // El error ya debe ser manejado dentro de `execute` por el llamador.
        // Este catch es solo para evitar que el worker muera silenciosamente.
        console.error(`[useUploadConcurrency] Error en job ${job.uploadId}`, error);
    }
    finally {
        activeWorkers--;
        processQueue();
    }
}

/**
 * Configura el límite de concurrencia global.
 */
function setConcurrency(limit:number):void {
    if(limit < 1){
        throw new Error('El límite de concurrencia debe ser al menos 1');
    }

    concurrencyLimit = limit;
    processQueue(); // Reintentar procesar si hay trabajos esperando
}

/**
 * Retorna el número de workers disponibles
 */
function getActiveCount():number {
    return activeWorkers;
}

/**
 * Obtiene el numero de trabajos pendientes en la cola.
 */
function getQueueLength():number {
    return queue.length;
}

/**
 * Limpia la cola de trabajos pendientes (útil al cancelar todo).
 * No cancela los workers activos, solo remueve los que aún no han empezado.
 */
function clearQueue():void {
    queue.length = 0;
}



// Exportar singleton
export const useUploadConcurrency = {
    enqueue,
    dequeue,
    enqueuePriority,
    setConcurrency,
    getActiveCount,
    getQueueLength,
    clearQueue
};
