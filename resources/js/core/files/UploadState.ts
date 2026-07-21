import { UploadProgress } from "./UploadProgress";
import { UploadStatus } from "./UploadStatus";

export interface UploadState {
    id:string;
    file:File;
    fileName:string;
    status:UploadStatus;
    progress:UploadProgress;
    error:string|null;
    fileId:number|null;
}
