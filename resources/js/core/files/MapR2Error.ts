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

export const uploadCancelByUserMsg:string = "Subida cancelada por el usuario";

export function mapR2Error(error:any):string {

    // cancelación por el usuario
    if(error.message === 'UPLOAD_CANCELED' || error.name === 'AbortError'){
        return uploadCancelByUserMsg;
    }

    // Error de red
    if (error.message === 'Network Error') {
        return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
    }

    if (error.code === 'ECONNABORTED') {
        return 'La subida tardó demasiado. Verifica tu conexión e intenta de nuevo.';
    }

    if (error.code === 'ERR_NETWORK') {
        return 'Error de red. Verifica tu conexión a internet.';
    }

    // error de CORS
    if (error.message?.includes('CORS') || error.message?.includes('cors')) {
        return 'Error de conexión con el servidor. Contacta al administrador.';
    }

    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    if(backendMessage) return backendMessage;
    if(status && status in errorMessages) return errorMessages[status];

    return "Error desconocido al subir el archivo.";
}

