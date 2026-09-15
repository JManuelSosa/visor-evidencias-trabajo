<script setup lang="ts">
import { computed } from 'vue';
import { AnnouncementFile, FileType } from '@/core/acl/announcements/AnnouncementFile';
import FileLink from '@/components/atoms/FileLink.vue';

const props = defineProps<{
    titulo:string;
    autor:string;
    contenido:string;
    files:AnnouncementFile[];
}>();

const fileFinders:FileType[] = ["document", "pdf", "presentation", "spreadsheet"];
const mediaFileFinders:FileType[] = ["image", "video"];

const documentFiles = computed(() => {
    return props.files.filter(file => fileFinders.includes(file.file_type)).sort((a, b) => a.sort_order - b.sort_order);
});

const mediaFiles = computed(() => {
    return props.files.filter(file => mediaFileFinders.includes(file.file_type)).sort((a, b) => a.sort_order - b.sort_order);
})


</script>

<template>
    <article class="bg-background h-fit rounded-3xl shadow-card-2 p-8">
        <header class="flex flex-col mb-4">
            <h2 class="text-system-theme-700 font-bold text-3xl truncate block">{{ titulo }}</h2>
            <div class="text-sm">
                <span class="text-system-theme-500">Creado por: </span><span class="text-system-theme-900 font-semibold">{{ autor }}</span>
            </div>
        </header>

        <div class="flex flex-col md:flex-row gap-4">
            <section class="rounded-xl h-fit flex-1 bg-white border border-gray-300 p-5">
                <div v-html="contenido" class="rich-text-content"></div>
            </section>
            <section class="rounded-xl shrink-0 bg-system-theme-100 p-5 h-fit max-w-1/4 overflow-hidden">
                <h3>Documentos adjuntos</h3>
                <ul class="flex flex-col gap-1">
                    <template v-for="file in documentFiles" :key="file.url">
                        <FileLink :title="file.title" :url="file.url" :file-type="file.file_type"/>
                    </template>
                </ul>
            </section>
        </div>


    </article>
</template>
