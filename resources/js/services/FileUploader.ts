import { presignedUrlService, uploadToR2 } from "./factories/fileUploadFactory";
import { ContextType } from "@/core/files/ContextType";

/**
 * Servicio de lógica pura para subir archivos a R2.
 *
 * Responsabilidades:
 * - Orquestar la subida de 1 archivo: Url firmada -> Subida a storage
 * - Retornar el fileId cuando la subida es exitosa
 * - Respetar el AbortSignal para cancelación externa.
 */

export class FileUploader {

    /**
     * Sube un archivo completo a R2
     * @param file - Archivo a subir
     * @param context - Contexto en el que se guardará (Depende de la categoria donde se sube el archivo: anuncio, perfil o reporte)
     * @param signal - Abort signal para cancelación externa
     * @param onProgress - Callback opcional para reportar progreso de subida
     * @returns Promise con el fileId de la base de datos
     * @throws Error si la subida falla o es cancelada
     */
    async upload(file:File, context:ContextType, signal:AbortSignal, onProgress?:(loaded:number, total:number) => void):Promise<number> {

        // Obtener url firmada del servidor
        const { file_id, upload_url, headers } = await presignedUrlService.getPresignedUrl(file.name, file.type, file.size, context);

        // Subir a R2
        await uploadToR2(file, upload_url, headers, signal, onProgress);

        return file_id;
    }
}

export const fileUploader = new FileUploader();
