import { onBeforeUnmount, h } from "vue";
import { toast } from 'vue-sonner';

//* Composables
import { useFileUploadQueue } from "@/composables/files/useFileUploadQueue";
import { useUploadTracker } from "@/composables/files/useUploadTracker";
import { useUploadEvents } from "@/composables/files/useUploadEvents";

//* Types
import type { FileItem } from "@/core/FileItem";
import type { ContextType } from "@/core/files/ContextType";

//* CustomToast
import FileErrorToast from "@/components/atoms/FileErrorToast.vue";

/**
 * Composable que gestiona la UI de toast para las subidas de archivos.
 */

export function useFileUploadToast(onFileSuccess:(fileItem:FileItem) => void) {

    const toastPool = new Map<string, string|number>();
    const unsubscribers = new Map<string, (() => void)[]>();

    function handleFilesSelected(files:File[], context:ContextType):string[] {

        // Iniciar subidas y obtener los id's generados
        const uploadIds = useFileUploadQueue.startUploads(files, context);

        // Configurar toast y suscripcions para cada archivo
        uploadIds.forEach((uploadId) => {

            const upload = useUploadTracker.getUpload(uploadId);
            if(!upload) return;

            const toastId = toast.loading(`${upload.fileName} - Cargando archivo..`, { duration:Infinity });
            toastPool.set(uploadId, toastId);

            const unsubs:(() => void)[] = [];

            // Progreso
            const progressEvent = useUploadEvents.onProgress(uploadId, (progress) => {
                const tId = toastPool.get(uploadId);
                if(tId) {
                    toast.loading(`${upload.fileName} - ${progress.percentage}%`, { id:tId });
                }
            });

            unsubs.push(progressEvent);

            // Éxito
            const successEvent = useUploadEvents.onSuccess(uploadId, (fileId) => {
                const tId = toastPool.get(uploadId);
                if(tId){
                    toast.success(`${upload.fileName} cargado correctamente`, { id:tId });
                    toastPool.delete(uploadId);
                }

                // Notificar al componente padre inmediatamente
                onFileSuccess({
                    id: uploadId,
                    fileId: fileId,
                    file: upload.file,
                    name: upload.file.name,
                    size: upload.file.size,
                    type: upload.file.type,
                    title: ''
                });

                // Liberar memoria inmediatamente después de notificar
                useUploadTracker.discardUpload(uploadId);
                // Limpiar suscripciones de este upload específico
                useUploadEvents.unsubscribeAll(uploadId);
            });

            unsubs.push(successEvent);

            // Error
            const errorEvent = useUploadEvents.onError(uploadId, (errorMessage) => {
                const tId = toastPool.get(uploadId);

                if(tId){
                    toast.custom((toastId) => h(FileErrorToast, {
                        filename: upload.fileName,
                        errorMessage: errorMessage,
                        onRetry: () => {
                            handleRetry(uploadId, context);
                        },
                        onCancel: () => {
                            handleDiscard(uploadId);
                        }
                    }), {
                        id:tId,
                        duration:Infinity
                    });
                }
            });

            unsubs.push(errorEvent);
            unsubscribers.set(uploadId, unsubs);
        });

        return uploadIds;
    }

    function handleRetry(uploadId:string, context:ContextType): void {
        const upload = useUploadTracker.getUpload(uploadId);
        if(!upload) return;

        const toastId = toastPool.get(uploadId);
        if(toastId){
            toast.loading(`${upload.fileName} - Reintentado...`, { id:toastId });
        }

        useFileUploadQueue.retryUpload(uploadId, context);
    }

    function handleDiscard(uploadId:string):void {
        const toastId = toastPool.get(uploadId);
        if(toastId){
            toast.dismiss(toastId);
        }

        const unsubs = unsubscribers.get(uploadId);
        if(unsubs){
            unsubs.forEach(unsub => unsub());
            unsubscribers.delete(uploadId);
        }

        useFileUploadQueue.discardUpload(uploadId);
        toastPool.delete(uploadId);
    }

    function handleDropzoneError(message:string):void {
        toast.error(message);
    }

    onBeforeUnmount(() => {
        unsubscribers.forEach((unsubs) => unsubs.forEach(unsub => unsub()));
        unsubscribers.clear();
        toastPool.clear();
        useFileUploadQueue.cancelAll();
    });

    return {
        handleFilesSelected,
        handleDiscard,
        handleRetry,
        handleDropzoneError
    }
}
