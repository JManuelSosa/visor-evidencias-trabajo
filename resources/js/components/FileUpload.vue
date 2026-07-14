<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FileItem } from '@/core/FileItem';
import { generateId } from '@/core/utils/GenerateID';

const isDragging = ref(false);
const dragCounter = ref(0);


const props = defineProps({
    modelValue: {
        type: Array as () => FileItem[],
        default: () => []
    },
    allowedTypes: {
        type: Array as () => string[],
        default: () => ['image/*', 'video/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
    },
    class: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue', 'error']);
const acceptAtributte = computed(() => props.allowedTypes.join(', '));

function isFileAllowed(file:File, allowedTypes:string[]):boolean {

    return allowedTypes.some(allowedType => {

        if(allowedType.endsWith('/*')){

            const category:string = allowedType.split('/')[0];
            return file.type.startsWith(category + '/');
        }

        if(allowedType.includes('/')) return file.type === allowedType;

        if(allowedType.startsWith('.')){
            const extension:string = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            return extension === allowedType.toLowerCase();
        }

        return false;
    })
}

function addFiles(fileList:FileList|null):void {

    if(!fileList || fileList.length === 0) return;

    const validFiles:FileItem[] = [];

    Array.from(fileList).forEach(file => {

        if(!isFileAllowed(file, props.allowedTypes)){
            emit('error', `El archivo "${file.name}" no es un tipo permitido`);
            return;
        }

        validFiles.push({
            id: generateId(),
            file,
            name: file.name,
            size: file.size,
            type: file.type
        });

    });

    if(validFiles.length > 0) emit('update:modelValue', [...props.modelValue, ...validFiles]);
}

function handleDragEnter(e:DragEvent):void {
    e.preventDefault();
    dragCounter.value++;
    isDragging.value = true;
}

function handleDragLeave(e:DragEvent):void {
    e.preventDefault();
    dragCounter.value--;

    if(dragCounter.value === 0) isDragging.value = false;
}

function handleDragOver(e:DragEvent):void {
    e.preventDefault();
}



function handleDrop(e:DragEvent):void {
    e.preventDefault();

    dragCounter.value = 0;
    isDragging.value = false;

    if(e.dataTransfer?.files) addFiles(e.dataTransfer.files);
}

</script>

<template>
    <div
        :class="['relative h-full w-full flex flex-col justify-center items-center rounded-md', props.class, {'bg-system-theme-100/50': isDragging}]",
        @dragenter="handleDragEnter"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
    >
        <svg class="absolute inset-0 h-full w-full pointer-events-none">
            <rect width="100%" height="100%" fill="none" class="transition-colors duration-200" :class="isDragging ? 'stroke-system-theme-800' : 'stroke-system-theme-400'" stroke-width="5" stroke-dasharray="12, 19" rx="10"/>
        </svg>

        <input
            type="file"
            multiple
            class="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
            @change="(e) => addFiles((e.target as HTMLInputElement).files)"
            :accept="acceptAtributte"
        >

        <div class="flex flex-col items-center justify-center pointer-events-none z-0 text-system-theme-400" :class="{ 'text-system-theme-800': isDragging }">
            <i class="ri-upload-cloud-line text-4xl transition-colors duration-200"></i>
            <span class="block text-xs md:text-base font-medium transition-colors duration-200">
                {{ isDragging ? '¡Suelta los archivos aquí' : 'Arrastra tu archivo aquí o haz click' }}
            </span>
        </div>
    </div>
</template>

<style scoped>
</style>
