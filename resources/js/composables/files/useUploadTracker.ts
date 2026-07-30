import { ref, computed } from "vue";
import { UploadState } from "@/core/files/UploadState";
import { UploadProgress } from "@/core/files/UploadProgress";
import { useUploadConcurrency } from "./useUploadConcurrency";

/**
 * Singleton que gestiona el estado reactivo de todos los uploads activos
 * y sus AbortControllers para cancelación.
 *
 * Responsabilidades:
 * - Mantener el Map reactivo de UploadState
 * - Gestionar AbortControllers por uploadId
 * - Exponer métodos de cancelación (individual y global)
 * - Proveer signals para inyectar funciones puras
 */

// Estado reactivo de todos los uploads
const uploads = ref<Map<string, UploadState>>(new Map());

// Estado no reactivo de controllers (solo tracking)
const controllers = new Map<string, AbortController>();

/**
 * Agrega nuevo upload al tracker
 */
function addUpload(uploadId:string, file:File):void {

    const initialState:UploadState = {
        id: uploadId,
        file: file,
        fileName: file.name,
        status: "pending",
        progress: {
            loaded: 0,
            total: file.size,
            percentage: 0
        },
        error: null,
        fileId: null
    }

    uploads.value.set(uploadId, initialState);
    uploads.value = new Map(uploads.value); // Trigger reactivity

    // Crear el AbortController para este upload
    const controller = new AbortController();
    controllers.set(uploadId, controller);
}

/**
 * Actualiza el estado de un upload específico
 */
function updateUpload(uploadId:string, updates:Partial<UploadState>):void {

    const current = uploads.value.get(uploadId);

    if(current){
        uploads.value.set(uploadId, { ...current, ...updates });
        uploads.value = new Map(uploads.value); // Trigger reactivity
    }
}

/**
 * Obtiene el estado de un upload específico
 */
function getUpload(uploadId:string):UploadState|undefined {
    return uploads.value.get(uploadId);
}

/**
 * Elimina un upload del tracker y cancela si está activo
 */
function discardUpload(uploadId:string):void {

    deleteUpload(uploadId);

    // Eliminar el estado reactivo
    uploads.value.delete(uploadId);
    uploads.value = new Map(uploads.value);
}

/**
 * Cancela un upload específico por su ID
 */
function cancelUpload(uploadId:string):void {
    deleteUpload(uploadId);

    // Remover de la cola de concurrencia si esta pendiente
    useUploadConcurrency.dequeue(uploadId);

    updateUpload(uploadId, {
        status:"error",
        error:"Subida cancelada por el usuario"
    });
}

/**
 * Cancela todos los uploads activos
 */
function cancelAll():void {
    controllers.forEach((controller) => controller.abort());
    controllers.clear();

    // Actualizar todos los uploads en estado 'uploading' a 'error'
    uploads.value.forEach((upload, uploadId) => {

        if(upload.status === "uploading" || upload.status === "pending"){
            updateUpload(uploadId, {
                status:"error",
                error:"Subida cancelada por el usuario"
            });
        }
    });
}

/**
 * Obtiene el AbortSignal para un uploadId específico
 * (Para inyectar en funciones puras como FileUploader)
 */
function getSignal(uploadId:string):AbortSignal|undefined {
    return controllers.get(uploadId)?.signal;
}

/**
 * Obtiene todos los uploads activos (uploading o pending)
 */
function getActiveUploads():UploadState[] {
    return Array.from(uploads.value.values()).filter((upload) =>
        upload.status === "uploading" || upload.status === "pending"
    );
}

/**
 * Limpia uploads completados (success o error)
 */
function clearCompleted():void {
    const active = new Map<string, UploadState>();

    uploads.value.forEach((state, key) => {
        if(state.status === "uploading" || state.status === "pending"){
            active.set(key,state);
        }
    });

    uploads.value = active;
    uploads.value = new Map(uploads.value);
}

export const useUploadTracker = {

    // Estado reactivo
    uploads:computed(() => Array.from(uploads.value.values())),

    // Gestión de estado
    addUpload,
    updateUpload,
    getUpload,

    // Cancelación
    cancelUpload,
    cancelAll,
    getSignal,

    // Utilidades
    getActiveUploads,
    clearCompleted,
    discardUpload
};


function deleteUpload(uploadId:string):void {
    // Cancelar si tiene controller activo
    const controller = controllers.get(uploadId);

    if(controller){
        controller.abort();
        controllers.delete(uploadId);
    }
}
