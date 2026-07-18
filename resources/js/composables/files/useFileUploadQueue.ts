import { ref, computed } from "vue";
import { fileUploader } from "@/services/FileUploader";
import { generateId } from "@/core/utils/GenerateID";
import { ContextType } from "@/core/files/ContextType";
import { UploadProgress } from "@/core/files/UploadProgress";

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadState {
    id:string;
    file:File;
    fileName:string;
    status:UploadStatus;
    progress:UploadProgress;
    error:string|null;
    fileId:number|null;
}

interface FileInQueue {
    file:File;
    uploadId:string;
}

type EventCallback<T = any> = (data:T) => void;
type EventListener = 'progress' | 'success' | 'error';

export function useFileUploadQueue(concurrency:number = 3) {

    const uploads = ref<Map<string, UploadState>>(new Map());

    const eventListeners = {
        progress: new Map<string, EventCallback<UploadProgress>>(),
        success: new Map<string, EventCallback<number>>(),
        error: new Map<string, EventCallback<string>>()
    };

    /**
     * Worker pool: Sube múltiples archivos en paralelo con límite de concurrencia
     */
    async function startUploads(files:File[], context:ContextType):Promise<void> {

        const queue:FileInQueue[] = files.map((file) => ({ file, uploadId:generateId() }));

        queue.forEach(({ file, uploadId }) => {

            const currentFile:UploadState = {
                id: uploadId,
                file:file,
                fileName: file.name,
                status: "pending",
                progress: { loaded: 0, total: file.size, percentage: 0 },
                error: null,
                fileId: null
            };

            uploads.value.set(uploadId, currentFile);
        });

        // Crear Workers
        const workers = Array.from({ length:Math.min(concurrency, queue.length) }, () => processQueue(queue, context));

        await Promise.all(workers);
    }


    /**
     * Worker individual procesa la cola
     */
    async function processQueue(queue:FileInQueue[], context:ContextType):Promise<void> {

        while(queue.length > 0) {

            const item = queue.shift();
            if(!item) break;

            const { file, uploadId } = item;
            await uploadSingleFile(file, uploadId, context);
        }

    }

    /**
     * Función para subir un archivo individual y actualizar su estado
     */
    async function uploadSingleFile(file:File, uploadId:string, context:ContextType):Promise<void> {

        updateUploadState(uploadId, { status: 'uploading' });

        try {

            const fileId =  await fileUploader.upload(file, context, {
                onProgress: (loaded, total) => {

                    const percentage = total > 0 ? Math.round((loaded * 100) / total) : 0;

                    updateUploadState(uploadId, { progress: { loaded, total, percentage } });
                    emitEvent('progress', uploadId, { loaded, total, percentage });
                }
            });

            updateUploadState(uploadId, {
                status: 'success',
                fileId
            });

            emitEvent('success', uploadId, fileId);
        }
        catch (e:any) {
            const errorMessage = e.response?.data?.message || e.message || "Error al subir el archivo";

            updateUploadState(uploadId, {
                status: 'error',
                error: errorMessage
            });

            emitEvent('error', uploadId, errorMessage);
        }
    }

    /**
     * Función para reintentar la subida de archivo que falló
     */
    async function retryUpload(uploadId:string, context:ContextType):Promise<void> {

        const state = uploads.value.get(uploadId);
        if(!state || state.status !== 'error') return;

        updateUploadState(uploadId, {
            status: "pending",
            error: null,
            progress: { loaded: 0, total: state.file.size, percentage: 0 }
        });

        await uploadSingleFile(state.file, uploadId, context);
    }


    /**
     * Actualiza el estado de un upload específico
     */
    function updateUploadState(uploadId:string, updates:Partial<UploadState>):void {

        const current = uploads.value.get(uploadId);

        if(current){
            uploads.value.set(uploadId, { ...current, ...updates });
            uploads.value = new Map(uploads.value); // Trigger reactivity
        }
    }

    /**
     * Obtener el estado de un upload específico
     */
    function getUploadState(uploadId:string):UploadState|undefined {
        return uploads.value.get(uploadId);
    }

    /**
     * Emitir eventos a los listeners
     */

    /**
     * Contratos de uso
     */
    function emitEvent(type:'progress', uploadId:string, data:UploadProgress):void;
    function emitEvent(type:'success', uploadId:string, data:number):void;
    function emitEvent(type:'error', uploadId:string, data:string):void;
    /**
     * Implementación
     */
    function emitEvent<T>(type:EventListener, uploadId:string, data:T) {
        const callback = eventListeners[type].get(uploadId) as EventCallback<T> | undefined;
        if(callback) callback(data);
    }


    /**
     * Funciones para suscribirse a eventos de un upload específico
     */
    function onProgress(uploadId:string, callback:EventCallback<UploadProgress>):() => void {
        eventListeners.progress.set(uploadId, callback);
        return () => eventListeners.progress.delete(uploadId);
    }

    function onSuccess(uploadId:string, callback:EventCallback<number>):() => void {
        eventListeners.success.set(uploadId, callback);
        return () => eventListeners.success.delete(uploadId);
    }

    function onError(uploadId:string, callback:EventCallback<string>):() => void {
        eventListeners.error.set(uploadId, callback);
        return () => eventListeners.error.delete(uploadId);
    }

    /**
     * Función helper para limpiar uploads completados
     */
    function clearCompleted():void {
        const active = new Map<string, UploadState>();

        uploads.value.forEach((state, key) => {

            if(state.status === "uploading" || state.status === "error"){
                active.set(key, state);
            }

        });

        uploads.value = active;
    }

    return {
        uploads: computed(() => Array.from(uploads.value.values())),
        startUploads,
        retryUpload,
        getUploadState,
        onProgress,
        onSuccess,
        onError,
        clearCompleted
    }
}
