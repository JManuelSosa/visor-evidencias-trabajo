import { computed } from "vue";

//* Composables
import { useUploadTracker } from "./useUploadTracker";
import { useUploadConcurrency, type UploadJob } from "./useUploadConcurrency";
import { useUploadEvents } from "./useUploadEvents";

//* Services
import { fileUploader } from "@/services/FileUploader";

//* Utils
import { generateId } from "@/core/utils/GenerateID";

//* Types
import type { ContextType } from "@/core/files/ContextType";
import type { UploadProgress } from "@/core/files/UploadProgress";

/**
 * Orquestador que coordina los 4 composables/servicios para gestionar la subida concurrente de múltiples archivos.
 *
 * Responsabilidades:
 * - Coordinar el flujo completo: tracker -> concurrency -> uploader -> events
 * - Exponer api pública para el componente
 * - Garantizar que los reintentos pasen por el pool de concurrencia
 */

// Funciones de API públicas

/**
 * Inicia la subida de múltiples archivos.
 * Cada archivo se registra en el tracker y encola en el pool de concurrencia.
 */
function startUploads(files:File[], context:ContextType):string[] {

    const uploadIds:string[] = [];

    files.forEach((file) => {

        const uploadId = generateId();
        uploadIds.push(uploadId);

        // Registrar en tracker
        useUploadTracker.addUpload(uploadId, file);

        // Crear Job con función execute que encapsula lógica
        const job:UploadJob = {
            uploadId,
            file,
            context,
            execute: async() => {
                await executeUpload(uploadId, file, context);
            }
        };

        // Encolar en el pool de concurrencia global
        useUploadConcurrency.enqueue(job);
    });

    return uploadIds;
}

// Reintentar

/**
 * Reintenta la subida de un archivo que faltó.
 * Pasa por el pool de concurrencia (Sin saltarse la cola).
 */
function retryUpload(uploadId:string, context:ContextType):void {

    const upload = useUploadTracker.getUpload(uploadId);
    if(!upload || upload.status !== 'error') return;

    // Resetear el estado a "pending"
    useUploadTracker.updateUpload(uploadId, { status:"pending", error:null, progress:{
        loaded: 0,
        total: upload.file.size,
        percentage: 0
    }});

    // Crear job y reencolar con prioridad
    const job:UploadJob = {
        uploadId,
        file: upload.file,
        context,
        execute: async() => {
            await executeUpload(uploadId, upload.file, context);
        }
    };

    useUploadConcurrency.enqueuePriority(job);
}

// Descartar

/**
 * Descarta un upload específico (útil para errores que el usuario ignora).
 * Eliminar del tracker y limpia suscripciones a eventos
 */
function discardUpload(uploadId:string):void {
    useUploadTracker.discardUpload(uploadId);
    useUploadEvents.unsubscribeAll(uploadId);
}

// Cancelación

/**
 * Cancela todos los upload activos.
 * Delega al tracker que aborta todos los AbortControllers
 */
function cancelAll():void {
    useUploadTracker.cancelAll();
    useUploadConcurrency.clearQueue();
}

/**
 * Cancela un upload específico por su id
 */
function cancelUpload(uploadId:string):void {
    useUploadTracker.cancelUpload(uploadId);
}

// Estado reactivo

/**
 * Expone el estado reactivo de todos los uploads.
 */
const uploads = computed(() => useUploadTracker.uploads.value);

// Suscripción a eventos

/**
 * Se suscribe a eventos de progreso de un upload específico.
 * @returns Función de unsuscribe para limpiar la suscripción
 */
function onProgress(uploadId:string, callback:(progress:UploadProgress) => void):() => void {
    return useUploadEvents.onProgress(uploadId, callback);
}

/**
 * Se suscribe a eventos de éxito en un upload específico.
 * @returns Función de unsubscribe para limpiar la suscripción
 */
function onSuccess(uploadId:string, callback:(fileId:number) => void):() => void {
    return useUploadEvents.onSuccess(uploadId, callback);
}

/**
 * Se suscribe a eventos de error de un upload específico
 * @returns Función de unsubscribe para limpiar la suscripción.
 */
function onError(uploadId:string, callback:(errorMessage:string) => void):() => void {
    return useUploadEvents.onError(uploadId, callback);
}

// Limpieza
/**
 * Limpia uploads completados (success o error del tracker).
 * Útil para liberar memoria después de que el usuario ve los toast
 */
function clearCompleted():void {
    useUploadTracker.clearCompleted();
}

/**
 * Logica interna: Ejecutar subida
 * Esta función es llamada por el worker pool
 */
async function executeUpload(uploadId:string, file:File, context:ContextType):Promise<void> {

    // Verifica si fue cancelado antes de empezar
    const currentUpload = useUploadTracker.getUpload(uploadId);

    if(!currentUpload || currentUpload.status === "error") return;

    // Actualizar estado a uploading
    useUploadTracker.updateUpload(uploadId, { status:"uploading" });

    try {

        // Obtener signal del tracker para la cancelación
        const signal = useUploadTracker.getSignal(uploadId);

        if(!signal) throw new Error('AbortSignal no encontrado para uploadId: ' + uploadId);

        const fileId = await fileUploader.upload(file, context, signal, (loaded, total) => {

            // Actualizar progreso en tracker
            const percentage = total > 0 ? Math.round((loaded * 100) / total) : 0;
            useUploadTracker.updateUpload(uploadId, {
                progress: { loaded, total, percentage }
            });

            // Emitir evento de progreso
            useUploadEvents.emitProgress(uploadId, { loaded, total, percentage });
        });

        // Actualizar estado a success
        useUploadTracker.updateUpload(uploadId, { status:"success", fileId });

        // Emitir evento de éxito
        useUploadEvents.emitSuccess(uploadId, fileId);

    } catch(error:any) {

        // Manejar error de cancelación
        if(error.message === 'UPLOAD_CANCELED'){
            useUploadTracker.updateUpload(uploadId, { status:"error", error:"Subida cancelada por el usuario" });
            useUploadEvents.emitError(uploadId, "Subida cancelada por el usuario");
            return;
        }

        // Manejar error de expiración de URL (403)
        if(error.response?.status === 403){
            const errorMessage:string = "El enlace de subida expiró. Por favor intenta de nuevo.";
            useUploadTracker.updateUpload(uploadId, { status:'error', error:errorMessage });
            useUploadEvents.emitError(uploadId, errorMessage);
            return;
        }

        // Otros errores
        const errorMessage = error.response?.data?.message || error.message || "Error al el subir archivo";
        useUploadTracker.updateUpload(uploadId, { status:'error', error: errorMessage });
        useUploadEvents.emitError(uploadId, errorMessage);
    }
}

export const useFileUploadQueue = {
    // Estado reactivo
    uploads,

    // Gestion de subidas
    startUploads,
    retryUpload,
    discardUpload,

    // Cancelación
    cancelAll,
    cancelUpload,

    // Suscripción a eventos
    onProgress,
    onSuccess,
    onError,

    // Limpieza
    clearCompleted
};
