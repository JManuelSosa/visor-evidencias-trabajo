<script setup lang="ts">
import { ref, computed } from 'vue';
import { AnnouncementFile, FileType } from '@/core/acl/announcements/AnnouncementFile';
import FileLink from '@/components/atoms/FileLink.vue';
import { Button } from 'primevue';

import Gallery from './Gallery.vue';

const props = defineProps<{
    titulo:string;
    autor:string;
    contenido:string;
    files:AnnouncementFile[];
}>();

const fileFinders:FileType[] = ["document", "pdf", "presentation", "spreadsheet"];
const mediaFileFinders:FileType[] = ["image", "video"];

const documentFiles = computed(() => {
    return props.files.filter(file => fileFinders.includes(file.file_type)).toSorted((a, b) => a.sort_order - b.sort_order);
});

const mediaFiles = computed(() => {
    return props.files.filter(file => mediaFileFinders.includes(file.file_type)).toSorted((a, b) => a.sort_order - b.sort_order);
})

const firstThumbnail = computed(() => {
    let thumbnail = null;

    for(let file of mediaFiles.value){
        if(file.file_type !== "image") continue;
        thumbnail = file;
        break;
    }

    return thumbnail;
});

const isOpenGallery = ref(false);

function handleGalleryState(state:boolean){
    isOpenGallery.value = state;
}

</script>

<template>
    <article class="bg-background h-fit rounded-3xl shadow-card-2 p-8">
        <header class="flex flex-col mb-4 gap-2.5">
            <h2 class="text-system-theme-700 font-bold text-3xl truncate block">{{ titulo }}</h2>
            <div class="text-sm">
                <span class="text-system-theme-500">Creado por: </span><span class="text-system-theme-900 font-semibold">{{ autor }}</span>
            </div>
        </header>

        <div class="flex flex-col md:flex-row gap-4 mb-4">
            <section class="rounded-xl h-fit flex-1 bg-white border border-gray-300 p-5">
                <div v-html="contenido" class="rich-text-content"></div>
            </section>

            <section v-if="documentFiles.length > 0" class="rounded-xl shrink-0 bg-system-theme-100 p-5 h-fit md:max-w-1/4 overflow-hidden">
                <h3>Documentos adjuntos</h3>
                <ul class="flex flex-col gap-1">
                    <template v-for="file in documentFiles" :key="file.url">
                        <FileLink :title="file.title" :url="file.url" :file-type="file.file_type"/>
                    </template>
                </ul>
            </section>
        </div>

        <section class="flex items-center bg-system-theme-200 rounded-xl p-3 min-h-18 justify-between" v-if="mediaFiles.length !== 0">
            <div class="flex items-center gap-5">
                <img v-if="firstThumbnail !== null"
                    :src="firstThumbnail.url"
                    :alt="`Portada de imagen para el anuncio: ${ titulo }`"
                    class="w-18 aspect-square"
                    loading="lazy"
                    decoding="async"
                >
                <div class="flex flex-col self-start">
                    <h3 class="text-lg font-semibold">Imágenes y videos</h3>
                    <span class="text-sm">Este anuncio tiene {{ mediaFiles.length }} videos e imágenes</span>
                </div>
            </div>


            <Button variant="link" class="text-xl! mr-6! hover:underline!" v-on:click="() => handleGalleryState(true)">
                Ver
            </Button>
        </section>

        <Gallery :is-open="isOpenGallery" @update:visible="handleGalleryState" :media-files="mediaFiles"></Gallery>


    </article>
</template>
