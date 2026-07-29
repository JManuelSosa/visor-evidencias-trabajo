/**
 * Mapea códigos HTTP de errores de R2/S3 a mensajes amigables para el usuario.
 *
 * R2/S3 devuelven errores en formato XML, no JSON, se mapean los códigos HTTP para generar el error correspondiente.
 *
 * @param error - Error capturado
 * @returns Mensaje de error personalizado
 * */

const errorMessages:Record<number,string> = {
    400: "El archivo no es válido o está corrupto. Verifique el formato e intente de nuevo.",
    403: "El enlace de subida expiró. Por favor, intente de nuevo.",
    404: "El destino de almacenamiento no existe. Contacte al administrador.",
    413: "El archivo excede el tamaño máximo permitido.",
    429: "Demasiadas solicitudes. Espere unos segundos e intente de nuevo.",
    500: "Error interno del servidor de almacenamiento. Intente más tarde.",
    502: "Servicio de almacenamiento temporalmente no disponible. Intente más tarde.",
    503: "Servicio de almacenamiento temporalmente no disponible. Intente más tarde.",
    504: "Servicio de almacenamiento temporalmente no disponible. Intente más tarde."
};

export function mapR2Error(error:any):string {

    // Manejamos la cancelación por el usuario
    if(error.message === 'UPLOAD_CANCELED' || error.name === 'AbortError'){
        return 'Subida cancelada por el usuario';
    }

    const status = error.response?.status;

    if(status && status in errorMessages) return errorMessages[status];

    return "Error desconocido al subir el archivo.";
}

