import axios from "axios";

export async function uploadToR2(file:File, uploadUrl:string, headers:Record<string,string>, signal:AbortSignal, onProgress?: (loaded:number, total:number) => void):Promise<void> {

    try {
        await axios.put(uploadUrl, file, {
            headers:{ ...headers, 'Content-Type': file.type },
            onUploadProgress: (progressEvent) => {
                if(progressEvent.total && onProgress){
                    onProgress(progressEvent.loaded, progressEvent.total);
                }
            },
            signal:signal
        });
    }
    catch(error) {
        if(axios.isCancel(error)){
            throw new Error('UPLOAD_CANCELED');
        }
        throw error;
    }

}
