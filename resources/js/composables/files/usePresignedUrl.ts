import axios from "axios";
import { ContextType } from "@/core/files/ContextType";

interface PresignedUrlResponse {
    file_id:number;
    upload_url:string;
    headers:Record<string,string>;
}

const endpointUrl = '/api/uploads/presigned-url';

export function usePresignedUrl() {

    async function getPresignedUrl(filename:string, mimeType:string, size:number, context:ContextType):Promise<PresignedUrlResponse> {

        const payload = { filename, mime_type: mimeType, size, context };
        const { data } = await axios.post<PresignedUrlResponse>(endpointUrl, payload);

        return data;
    }

    return { getPresignedUrl };
}
