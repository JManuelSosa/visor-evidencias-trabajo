import { usePresignedUrl } from "@/composables/usePresignedUrl";
import { useDirectUpload } from "@/composables/useDirectUpload";
import { ContextType } from "@/core/files/ContextType";

interface UploadCallbacks {
    onProgress?: (loaded:number, total:number) => void;
}

/**
 * Servicio de lógica pura para subir archivos a R2.
 * No tiene estado reactivo, son solamente funciones puras
 */
export class FileUploader {

    private presignedUrlService = usePresignedUrl();
    private directUploadService = useDirectUpload();

    /**
     * Sube un archivo completo a R2
     * @param file - Archivo a subir
     * @param context - Contexto en el que se guardará (Depende de la categoria donde se sube el archivo: anuncio, perfil o reporte)
     * @param callbacks - Callbacks opcionales para el progreso
     * @returns Promise con el fileId de la base de datos
     * @throws Error si la subida falla
     */
    async upload(file:File, context:ContextType, callbacks:UploadCallbacks = {}):Promise<number> {

        // Obtener url firmada del servidor
        const { file_id, upload_url, headers } = await this.presignedUrlService.getPresignedUrl(file.name, file.type, file.size, context);

        // Subir a R2
        await this.directUploadService.uploadToR2(file, upload_url, headers, callbacks.onProgress);

        return file_id;
    }
}

export const fileUploader = new FileUploader();
