import { ref } from "vue";
import { fileUploader } from "@/services/FileUploader";
import type { ContextType } from "@/core/files/ContextType";
import type { UploadProgress } from "@/core/files/UploadProgress";
import { generateId } from "@/core/utils/GenerateID";

/**
 * Composable para subir 1 único archivo
 */

export function useFileUpload() {

    const uploading = ref(false);
    const progress = ref<UploadProgress>({
        loaded:0,
        total:0,
        percentage:0
    });
    const error = ref<string|null>(null);

    async function uploadFile(file:File, context:ContextType):Promise<number|null> {
        uploading.value = true;
        error.value = null;
        progress.value = { loaded:0, total:file.size, percentage:0 };

        try {

            const uploadId = generateId();

            const fileId = await fileUploader.upload(file, context, uploadId, {
                onProgress: (loaded, total) => {
                    progress.value = { loaded, total, percentage: total > 0 ? Math.round((loaded * 100) / total) : 0 }
                }
            });

            return fileId;
        }
        catch (e:any) {
            const errorMessage = e.response?.data?.message || e.message || "Error al subir el archivo";
            error.value = errorMessage;
            return null;
        }
        finally {
            uploading.value = false;
        }
    }

    function resetProgress():void {
        progress.value = { loaded:0, total:0, percentage:0 };
    }

    return {
        uploadFile,
        uploading,
        progress,
        error,
        resetProgress
    }
}
