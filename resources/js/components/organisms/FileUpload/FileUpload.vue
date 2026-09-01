<script setup lang="ts">
//* Composables
import { useFileUploadToast } from './useFileUploadToast';
//* Types
import type { FileItem } from '@/core/FileItem';
import type { ContextType } from '@/core/files/ContextType';

//* Componentes
import FileUploadZone from '@/components/molecules/FileUploadZone.vue';

interface Props {
    modelValue?:FileItem[];
    allowedTypes?:string[];
    class?:string;
    context:ContextType;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    allowedTypes: () => ['image/*', 'video/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
    class: ''
});

const emit = defineEmits<{
    'update:modelValue': [newFiles:FileItem[]];
}>();

const { handleFilesSelected, handleDropzoneError } = useFileUploadToast((newFile) => {
    emit('update:modelValue', [...props.modelValue, newFile]);
});

</script>

<template>
    <div :class="['flex flex-col h-full w-full', props.class]">
        <FileUploadZone
            :allowed-types="allowedTypes"
            :context="context"
            @files-selected="(files) => handleFilesSelected(files, context)"
            @error="handleDropzoneError"
        />
    </div>
</template>

