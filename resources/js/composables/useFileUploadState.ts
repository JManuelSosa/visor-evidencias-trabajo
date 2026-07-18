import { ref, type Ref } from 'vue';

interface UploadProgress {
    loaded:number;
    total:number;
    percentage:number;
}

export function useFileUploadState() {

    const uploading:Ref<boolean> = ref(false);
    const progress:Ref<UploadProgress> = ref<UploadProgress>({
        loaded: 0,
        total: 0,
        percentage: 0
    });
    const error:Ref<string|null> = ref<string|null>(null);

    function setUploading(value:boolean){
        uploading.value = value;
    }

    function updateProgress(loaded:number, total:number){
        progress.value = {
            loaded,
            total,
            percentage: total > 0 ? Math.round((loaded * 100) / total) : 0
        };
    }

    function setError(message:string|null){
        error.value = message;
    }

    function reset(){
        uploading.value = false;
        progress.value = { loaded:0, total:0, percentage:0 };
        error.value = null;
    }

    return {
        uploading,
        progress,
        error,
        setUploading,
        updateProgress,
        setError,
        reset
    };
}

