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
    <div class="container-toast-error flex rounded-2xl border border-red-200 bg-red-100 py-2 xs:py-3 px-1.5 xs:px-4 xs:w-130 text-red-600 items-center">
        <div class="flex flex-1">
            <div class="mr-4 shrink-0 flex justify-center items-center">
                <i class="ri-file-warning-fill text-2xl"></i>
            </div>
            <div class="flex-1 flex flex-col gap-0.5">
                <span class="block xs:shrink-0 text-sm text-red-800 font-bold truncate max-w-45 xs:max-w-70" v-bind:title="props.filename">Error al subir el archivo: {{ props.filename }}</span>
                <div class="flex text-xs flex-1">
                    <span class="max-h-10 line-clamp-1 xs:line-clamp-2" v-bind:title="props.errorMessage">{{ props.errorMessage }}</span>
                </div>
            </div>
        </div>

        <div class="flex gap-1 xs:gap-2.5 flex-col-reverse xs:flex-row shrink-0 ">
            <Button v-on:click="handleCancel" variant="text" class="text-red-600! h-6 w-14 xs:w-18 text-xs! p-0!">
                <span class="block xs:hidden">Desc.</span>
                <span class="hidden xs:block">Descartar</span>
            </Button>
            <Button v-on:click="handleRetry" class="h-6 w-14 xs:w-18 text-xs! p-0!">
                <span class="block xs:hidden">Rein.</span>
                <span class="hidden xs:block">Reintentar</span>
            </Button>
        </div>
    </div>
</template>
