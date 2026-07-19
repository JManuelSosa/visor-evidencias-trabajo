<script setup lang="ts">
import { onUnmounted, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useFileUploadQueue } from '@/composables/files/useFileUploadQueue';
import type { FileItem } from '@/core/FileItem';
import type { ContextType } from '@/core/files/ContextType';
import { generateId } from '@/core/utils/GenerateID';

import FileUploadZone from './molecules/FileUploadZone.vue';

interface Props {
    modelValue?:FileItem[];
    allowedTypes?:string[];
    class?:string;
    context:ContextType;
    concurrency?:number;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    allowedTypes: () => ['image/*', 'video/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
    class: '',
    concurrency:3
});

const emit = defineEmits<{
    'update:modelValue': [newFiles:FileItem[]];
    'error': [message:string];
}>();

const queue = useFileUploadQueue(props.concurrency);

//Map para guardar los id de los toast
const toastPool = new Map<string, string|number>();

async function handleFilesSelected(files:File[]):Promise<void> {

    // Iniciar subidas
    await queue.startUploads(files, props.context);

    // Recopilar éxitos
    const successfulFiles:FileItem[] = [];

    queue.uploads.value.forEach(upload => {

        if(upload.status === "success" && upload.fileId){

            const currentFile:FileItem = {
                id: generateId(),
                fileId: upload.fileId,
                file: upload.file,
                name: upload.file.name,
                size: upload.file.size,
                type: upload.file.type,
                title: ""
            };

            successfulFiles.push(currentFile);
        }
    });

    if(successfulFiles.length > 0) emit('update:modelValue', [...props.modelValue, ...successfulFiles]);

    // Limpieza diferida
    setTimeout(() => {
        queue.clearCompleted(); //Limpiar estados 'success'

        // Limpieza segura del Map de toast
        queue.uploads.value.forEach(upload => {
            if(upload.status === 'success'){
                toastPool.delete(upload.id);
            }
        });
    }, 3000);
}

// Observar reactivamente cambios en la cola
watch(() => queue.uploads.value, (uploads) => {

    uploads.forEach(upload => {

        // Si el toast ya fue destruido o no existe, se crea
        let toastId = toastPool.get(upload.id);

        if(!toastId && (upload.status === 'uploading' || upload.status === 'error')){
            // Si por alguna razon se pierde el id lo recreamos
            toastId = toast.loading(`${upload.fileName} - 0%`, { duration:Infinity });
            toastPool.set(upload.id, toastId);
        }

        if(!toastId) return;

        if(upload.status === "uploading"){
            toast.loading(`${upload.fileName} - ${upload.progress.percentage}%`, { id:toastId });
        }
        else if(upload.status === "success"){
            toast.success(`${upload.fileName} subido correctamente`, { id:toastId });
            toastPool.delete(upload.id);
        }
        else if(upload.status === "error"){
            toast.error(`${upload.fileName}: ${upload.error}`, {
                id:toastId,
                duration:Infinity,
                action: {
                    label:"Reintentar",
                    onClick: () => handleRetry(upload.id)
                }
            });
        }
    });
}, { deep:true });

async function handleRetry(uploadId:string):Promise<void> {

    const upload = queue.getUploadState(uploadId);
    if(!upload) return;

    // Actualizar el toast a "cargando" de nuevo
    const toastId = toastPool.get(uploadId);

    if(toastId){
        toast.loading(`${upload.fileName} - 0%`, { id: toastId });
    }

    await queue.retryUpload(uploadId, props.context);
}

function handleDropzoneError(message:string):void {
    emit('error', message);
}

// Limpieza al desmotar el componente
onUnmounted(() => {
    toastPool.clear();
});
</script>

<template>
    <div :class="['flex flex-col h-full w-full', props.class]">
        <FileUploadZone
            :allowed-types="allowedTypes"
            :context="context"
            @files-selected="handleFilesSelected"
            @error="handleDropzoneError"
        />
    </div>
</template>

