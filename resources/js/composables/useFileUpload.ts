import { toast } from "vue-sonner";
import { useFileUploadState } from "./useFileUploadState";
import { usePresignedUrl } from "./usePresignedUrl";
import { useDirectUpload } from "./useDirectUpload";
import { ContextType } from "@/core/files/ContextType";

export function useFileUpload() {

    const state = useFileUploadState();
    const { getPresignedUrl } = usePresignedUrl();
    const { uploadToR2 } = useDirectUpload();

    async function uploadFile(file:File, context:ContextType):Promise<number|null> {

        state.setUploading(true);
        state.setError(null);

        try {
            const { file_id, upload_url, headers } = await getPresignedUrl(file.name, file.type, file.size, context);
            await uploadToR2(file, upload_url, headers, state.updateProgress)

            return file_id;
        }
        catch (error:any) {
            const errorMessage = error.response?.data?.message || error.message || 'Error al subir el archivo';
            state.setError(errorMessage);
            toast.error(errorMessage);
            return null;
        }
        finally {
            state.setUploading(false);
        }
    }

    async function uploadMultipleFiles(files:File[], context:ContextType, concurrency:number = 3):Promise<(number|null)[]> {

        const results:(number|null)[] = [];
        const queue = [...files];
        const activeUploads:Promise<void>[] = [];

        async function uploadNext():Promise<void> {

            if(queue.length === 0) return;

            const file = queue.shift()!;
            const fileId = await uploadFile(file, context);
            results.push(fileId);

            if(queue.length > 0) {
                const nextUpload = uploadNext();
                activeUploads.push(nextUpload);
                await nextUpload;
            }
        }

        const initialUploads = Array.from({length:Math.min(concurrency, files.length)}, () => uploadNext());
        await Promise.all(initialUploads);

        return results;
    }

    return {
        uploadFile,
        uploadMultipleFiles,
        uploading: state.uploading,
        progress: state.progress,
        error: state.error,
        resetProgress: state.reset
    };
}
