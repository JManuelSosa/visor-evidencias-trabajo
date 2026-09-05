<script setup lang="ts">
import type { FileItem } from '@/core/FileItem';
import { Button, InputText } from 'primevue';

const props = defineProps<{
    file:FileItem,
    error?:string
}>();

const emit = defineEmits<{
    remove:[id:string],
    'update:title':[id:string, newTitle:string]
}>();

function formatSize(bytes:number):string {
    if(bytes === 0) return '0 Bytes';

    const k:number = 1024;
    const sizes:string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i:number = Math.floor(Math.log(bytes)/Math.log(k));

    return parseFloat(( bytes/Math.pow(k,i) ).toFixed(2)) + ' ' + sizes[i];
}

</script>

<template>
<div class="w-full flex justify-between items-center gap-3 min-w-0">

    <div class="flex flex-col flex-1 gap-1.5 min-w-0">
        <div class="flex flex-col min-w-0">
            <label :for="`input-title-${file.id}`" class="font-semibold" :class="{ 'text-red-400': error, 'text-system-theme-500': !error }">Titulo del archivo</label>
            <div class="flex gap-1">
                <i class="ri-file-line text-2xl md:text-4xl block shrink-0" :class="{'text-system-theme-400':!error, 'text-red-400': error }"></i>
                <InputText fluid :id="`input-title-${file.id}`" size="small" :modelValue="file.title || ''" @update:modelValue="(currentText) => emit('update:title', file.id, currentText ?? '')" :invalid="!!error"/>
                <Button @click="emit('remove', file.id)" title="Eliminar archivo" class="bg-red-600! border-red-600! hover:border-red-800! hover:bg-red-800! shrink-0!" size="small">
                    <i class="ri-delete-bin-2-line text-lg md:text-xl"></i>
                </Button>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="flex min-w-0 gap-3 items-center">
                <span class="text-sm font-medium text-system-theme-900 truncate">
                    {{ file.name }}
                </span>
                <span> - </span>
                <span class="text-xs text-system-theme-500">
                    {{ formatSize(file.size) }}
                </span>
            </div>
            <span v-if="error" class="block text-xs text-red-600 font-semibold">{{ error }}</span>
        </div>


    </div>
</div>
</template>
