<script setup lang="ts">
import { Button } from 'primevue';

const props = defineProps<{
    filename:string;
    errorMessage:string;
    onRetry:() => void;
    onCancel:() => void;
}>();

const emit = defineEmits<{
    (e: 'closeToast'): void
}>()

function handleRetry(){
    props.onRetry();
    emit('closeToast');
}

function handleCancel(){
    props.onCancel();
    emit('closeToast');
}
</script>

<template>
    <div class="container-toast-error flex rounded-2xl border border-red-200 bg-red-100 py-3.5 max-h-45 text-red-600">
        <div class="w-1/5 shrink-0 flex justify-center items-center">
            <i class="ri-file-warning-fill text-4xl"></i>
        </div>
        <div class="flex-1 flex flex-col gap-2">
            <span class="block shrink-0 text-red-800 font-bold">Error al subir el archivo</span>
            <div class="flex flex-col gap-1.5 text-xs flex-1">
                <span class="text-red-800">{{ props.filename }}</span>
                <span class="max-h-12 line-clamp-3">{{ props.errorMessage }}</span>
            </div>
            <div class="flex w-full justify-end gap-2.5 shrink-0 px-5">
                <Button v-on:click="handleCancel" variant="text" class="text-red-600! h-8 w-18 text-xs! p-0!">Descartar</Button>
                <Button v-on:click="handleRetry" class="h-8 w-18 text-xs! p-0!">Reintentar</Button>
            </div>
        </div>
    </div>
</template>
