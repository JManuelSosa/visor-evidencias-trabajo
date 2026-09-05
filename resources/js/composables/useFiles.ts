import { ref, computed, type Ref, type ComputedRef } from "vue";

import { FileItem } from "@/core/FileItem";

export function useFiles(){

    const files:Ref<FileItem[]> = ref<FileItem[]>([]);
    const counterFiles:ComputedRef<number> = computed(() => files.value.length);

    function removeFile(id:string) {

        if(!id) return;
        files.value = files.value.filter(e => e.id !== id);
    }

    function setFiles(newFiles:FileItem[]){
        files.value = newFiles || [];
    }

    function setTitle(id:string, title:string){
        const index:number = files.value.findIndex(file => file.id === id);

        if(index === -1) return;
        if(title.trim() === '') return;

        files.value[index].title = title;
    }

    function clearFileList():void {
        files.value = [];
    }


    return { files, counterFiles, removeFile, setFiles, setTitle, clearFileList }
}
