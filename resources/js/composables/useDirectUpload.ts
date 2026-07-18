import axios from "axios";

export function useDirectUpload() {

    async function uploadToR2(file:File, uploadUrl:string, headers:Record<string,string>, onProgress?: (loaded:number, total:number) => void):Promise<void> {

        await axios.put(uploadUrl, file, {
            headers: { ...headers, 'Content-Type': file.type },
            onUploadProgress: (progressEvent) => {
                if(progressEvent.total && onProgress) onProgress(progressEvent.loaded, progressEvent.total);
            }
        });
    }

    return { uploadToR2 };
}
