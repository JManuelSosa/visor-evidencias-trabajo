<script setup lang="ts">
import FileItemList from '../molecules/FileItemList.vue';
import { FileUpload } from './FileUpload';
import { FileItem } from '@/core/FileItem.ts';
import { ContextType } from '@/core/files/ContextType.ts';
import { useIndexedErrors } from '@/composables/errors/useIndexedErrors.ts';

interface FilesFormSectionProps {
    files:FileItem[],
    fileCounter:number,
    context:ContextType,
    errors?:Record<string,string>,
    isProcessing?:boolean
}
const props = withDefaults(defineProps<FilesFormSectionProps>(), {
    errors: () => ({}),
    isProcessing:false
})

const emit = defineEmits<{
    remove: [id:string],
    'update:files': [newFiles:FileItem[]],
    'update:title': [id:string, title:string]
}>();

// Manejo de errores
const { errorsById, hasErrors, cleanItemError } = useIndexedErrors<'title'>('files', () => props.files, () => props.errors);

function handleUpdateTitle(id:string, title:string){
    cleanItemError(id);
    emit('update:title', id, title);
}

function handleRemove(id:string){
    cleanItemError(id);
    emit('remove', id);
}

</script>

<template>
<fieldset class="p-6 w-full flex flex-col md:flex-row gap-8 min-w-0">
    <legend class="sr-only">Archivos</legend>

    <div class="min-h-60 h-60 w-full min-w-0 md:h-auto flex md:flex-1 bg-neutral-100">
        <FileUpload v-bind:model-value="files" :context="context" @update:model-value="(newFiles) => emit('update:files', newFiles)" class="min-w-0!" :is-processing="props.isProcessing"/>
    </div>

    <div class="w-full min-w-0 md:w-4/10 flex flex-col gap-5">
        <div class="flex flex-col">
            <span class="text-center">Tus archivos subidos ({{ props.fileCounter }})</span>
            <span v-if="hasErrors" class="text-red-600 text-center">Uno o mas archivos tienen un error, favor de corregir</span>
        </div>
        <div>
            <ul class="flex flex-col gap-5 w-full">
                <li v-for="file in files" :key="file.id" class="flex gap-3 items-center max-w-full">
                    <FileItemList :file="file" :error="errorsById[file.id]?.title"
                        @remove="(id) => handleRemove(id)"
                        @update:title="(id, title) => handleUpdateTitle(id, title)"
                    />
                </li>
            </ul>
        </div>
    </div>
</fieldset>
</template>
