import type { UploadProgress } from "@/core/files/UploadProgress";

/**
 * Tipos de callbacks para cada evento
 */
type ProgressCallback = (data:UploadProgress) => void;
type SuccessCallback = (fileId:number) => void;
type ErrorCallback = (errorMessage:string) => void;

/**
 * Singleton que gestiona el sistema de eventos manual para uploads.
 *
 * Responsabilidad única:
 * - Mantener suscripciones por uploadId y tipo de evento
 * - Permitir emitir eventos a suscriptores específicos
 * - Proveer funciones de limpieza para evitar memory leaks
 *
 * NO gestiona:
 * - Estado reactivo
 * - Concurrencia
 * - Lógica de subida
 *
 * Ventaja sobre deep watch:
 * - Cada toast se suscribe puntualmente a su uploadId
 * - Vue no tiene que diffear objetos File pesados en cada tick de progreso
 * - Más performante con múltiples subidas en paralelo
 */

// Estado interno: Map de uploadId -> Set de callbacks por tipo de evento
const progressListeners = new Map<string, Set<ProgressCallback>>();
const successListeners = new Map<string, Set<SuccessCallback>>();
const errorListeners = new Map<string, Set<ErrorCallback>>();

/**
 * Helper: Agrega un listener a un Map específico.
 */
function addListener<T>(map:Map<string, Set<T>>, uploadId:string, callback:T): () => void {
    if(!map.has(uploadId)){
        map.set(uploadId, new Set());
    }

    map.get(uploadId)!.add(callback);

    // Retornar función unsubscribe
    return () => {
        const set = map.get(uploadId);
        if(set){
            set.delete(callback);
            if(set.size === 0) map.delete(uploadId);
        }
    };
}

/**
 * Helper: Emite un evento a todos los listeners de un uploadId
 */
function emitEvent<T>(map:Map<string, Set<T>>, uploadId:string, data:T extends (...args:any[]) => any ? Parameters<T>[0] : never):void {

    const set = map.get(uploadId);

    if(set){
        set.forEach((callback) => {
            try {
                (callback as Function)(data);
            }catch(error) {
                console.error(`[useUploadEvents] Error en listener para ${uploadId}:`, error);
            }
        });
    }
}

// Funciones de suscripción

/**
 * Se suscribe a eventos de progreso de un upload específico.
 * @returns Función de unsubscribe para limpiar la suscripción.
 */
function onProgress(uploadId:string, callback:ProgressCallback): () => void {
    return addListener(progressListeners, uploadId, callback);
}

/**
 * Se suscribe a eventos de éxito de un upload específico.
 * @returns Función de unsubscribe para limpiar la suscripción.
 */
function onSuccess(uploadId:string, callback:SuccessCallback):() => void {
    return addListener(successListeners, uploadId, callback);
}

function onError(uploadId:string, callback:ErrorCallback):() => void {
    return addListener(errorListeners, uploadId, callback);
}

// Funciones de emisión

/**
 * Emite un eventos de progreso a todos los suscriptores de un uploadId
 */
function emitProgress(uploadId:string, data:UploadProgress):void {
    emitEvent(progressListeners, uploadId, data);
}

/**
 * Emite un evento de éxito a todos los suscriptores de un uploadId
 */
function emitSuccess(uploadId:string, fileId:number):void {
    emitEvent(successListeners, uploadId, fileId);
}

/**
 * Emite un evento de error a todos los suscriptores de un uploadId
 */
function emitError(uploadId:string, errorMessage:string):void {
    emitEvent(errorListeners, uploadId, errorMessage);
}

// Funciones de limpieza

/**
 * Elimina todas las suscripciones de un uploadId específico.
 * Útil cuando un upload termina (sea con éxito o con error) y ya no se necesitan listeners
 */
function unsubscribeAll(uploadId:string):void {
    progressListeners.delete(uploadId);
    successListeners.delete(uploadId);
    errorListeners.delete(uploadId);
}

/**
 * Limpia todas las suscripciones de todos los uploads
 * Útil al desmontar componentes donde se esten usando
 */
function clearAll():void {
    progressListeners.clear();
    successListeners.clear();
    errorListeners.clear();
}

export const useUploadEvents = {

    // Suscripción
    onProgress,
    onSuccess,
    onError,

    // Emisión
    emitProgress,
    emitSuccess,
    emitError,

    // Limpieza
    unsubscribeAll,
    clearAll
};
