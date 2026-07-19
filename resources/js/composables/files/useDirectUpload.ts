import axios from "axios";

export function useDirectUpload() {

    const activeControllers = new Map<string, AbortController>();

    async function uploadToR2(file:File, uploadUrl:string, headers:Record<string,string>, uploadId:string, onProgress?: (loaded:number, total:number) => void):Promise<void> {

        const controller = new AbortController();
        activeControllers.set(uploadId, controller);

        try {
            await axios.put(uploadUrl, file, {
                headers: { ...headers, 'Content-Type': file.type },
                onUploadProgress: (progressEvent) => {
                    if(progressEvent.total && onProgress) onProgress(progressEvent.loaded, progressEvent.total);
                },
                signal:controller.signal
            });
        }
        catch(error){
            if(axios.isCancel(error)){
                throw new Error('UPLOAD_CANCELED');
            }
            throw error;
        }
        finally{
            activeControllers.delete(uploadId);
        }
    }

    function cancelUpload(uploadId:string):void {
        const controller = activeControllers.get(uploadId);
        if(controller){
            controller.abort();
            activeControllers.delete(uploadId);
        }
    }

    function cancelAllUploads():void {
        activeControllers.forEach((controller) => controller.abort());
        activeControllers.clear();
    }

    return { uploadToR2, cancelUpload, cancelAllUploads };
}
