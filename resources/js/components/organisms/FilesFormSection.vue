<script setup lang="ts">
import FileItemList from '../molecules/FileItemList.vue';
import FileUpload from '../FileUpload.vue';

import { toast } from 'vue-sonner';
import { FileItem } from '@/core/FileItem.ts';

const props = defineProps<{
    files:FileItem[],
    fileCounter:number
}>();

const emit = defineEmits<{
    remove: [id:string],
    'update:files': [newFiles:FileItem[]],
    'update:title': [id:string, title:string]
}>();

function handleUploadError(message:string){
    toast.error(message);
}

</script>

<template>
<fieldset class="p-6 w-full flex flex-col md:flex-row gap-8 min-w-0">
    <legend class="sr-only">Archivos</legend>

    <div class="min-h-60 h-60 w-full min-w-0 md:h-auto flex md:flex-1 bg-neutral-100">
        <FileUpload v-bind:model-value="files" @update:model-value="(newFiles) => emit('update:files', newFiles)" @error="handleUploadError" class="min-w-0!"/>
    </div>

    <div class="w-full min-w-0 md:w-4/10 flex flex-col gap-5">
        <span class="text-center">Tus archivos subidos ({{ props.fileCounter }})</span>
        <div>
            <ul class="flex flex-col gap-5 w-full">
                <li v-for="file in files" :key="file.id" class="flex gap-3 items-center max-w-full">
                    <FileItemList :file="file"
                        @remove="(id) => emit('remove', id)"
                        @update:title="(id, title) => emit('update:title', id, title)"
                    />
                </li>
            </ul>
        </div>
    </div>
</fieldset>
</template>
