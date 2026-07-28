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

const { handleFilesSelected, handleRetry, handleDiscard, handleDropzoneError } = useFileUploadToast((newFile) => {
    emit('update:modelValue', [...props.modelValue, newFile]);
});

// function testErrorToast(){
//     toast.custom(
//         (t) => h(FileErrorToast, {
//             filename: "documento_muy_pesado_y_largo_nombre.pdf",
//             errorMessage: "El enlace de subida expiró. Por favor, intenta de nuevo.",
//             onRetry: () => {
//                 console.log("Reintentando...");
//             },
//             onCancel: () => {
//                 console.log("Descartando...");
//             }
//         }),
//         { duration: Infinity }
//     );
// }

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

