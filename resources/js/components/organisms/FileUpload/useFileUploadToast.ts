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

//* Utils
import { uploadCancelByUserMsg } from "@/core/files/MapR2Error";

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

            const toastId = toast.loading(`${upload.fileName} - Cargando archivo..`, { duration:Infinity, position:'bottom-right' });
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

                    toast.dismiss(tId);

                    toast.success(`${upload.fileName} cargado correctamente`, { duration:3000 });
                    toastPool.delete(uploadId);
                }

                // Notificar al componente padre inmediatamente
                onFileSuccess({
                    id: uploadId,
                    fileId: fileId,
                    name: upload.file.name,
                    size: upload.file.size,
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

                if(errorMessage === uploadCancelByUserMsg){

                    toast.dismiss(tId);

                    toast.info(`${upload.fileName}: Subida cancelada`, {
                        id: uploadId,
                        duration: 3000
                    });

                    useUploadTracker.discardUpload(uploadId);
                    useUploadEvents.unsubscribeAll(uploadId);

                    return;
                }


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

        const oldToastId = toastPool.get(uploadId);

        if(oldToastId){
            toast.dismiss(oldToastId);
        }

        // 2. Crear un NUEVO toast de loading (sin ID específico)
        const newToastId = toast.loading(`${upload.fileName} - 0%`, {
            duration: Infinity,
            position: 'bottom-right'
        });

        // 3. Actualizar el toastPool con el nuevo ID
        toastPool.set(uploadId, newToastId);

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
        useFileUploadQueue.cancelAll();

        unsubscribers.forEach((_, uploadId) => {
            const tId = toastPool.get(uploadId);
            toast.dismiss(tId);
        });

        unsubscribers.forEach((unsubs) => unsubs.forEach(unsub => unsub()));
        unsubscribers.clear();
        toastPool.clear();
    });

    return {
        handleFilesSelected,
        handleDiscard,
        handleRetry,
        handleDropzoneError
    }
}
