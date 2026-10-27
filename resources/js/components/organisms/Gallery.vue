<script setup lang="ts">
import { ref } from 'vue';
import { AnnouncementFile } from '@/core/acl/announcements/AnnouncementFile';
import { Galleria } from 'primevue';

interface GalleryProps {
    isOpen:boolean;
    mediaFiles:AnnouncementFile[]
}

const props = withDefaults(defineProps<GalleryProps>(),{
    isOpen: false
});

const emit = defineEmits<{
    'update:visible':[open:boolean]
}>()

const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

function closeGallery(){
    emit('update:visible', false);
}

</script>

<template>
    <Galleria
        v-bind:visible="isOpen"
        @update:visible="closeGallery"
        :value="mediaFiles"
        :responsiveOptions="responsiveOptions"
        :numVisible="5"
        :circular="true"
        :fullScreen="true"
        :showItemNavigators="true"
        :showThumbnails="true"
    >
        <template #item="{ item }">
            <img class="item-img" :src="item.url" :alt="`Imagen con el titulo ${item.title}`" style="width: 100%; display: block" />
        </template>
        <template #thumbnail="{ item }">
            <div class="h-24 w-24 object-cover">
                <img class="item-thumbnail" :src="item.url" :alt="`Imagen con el titulo ${item.title}`"/>
            </div>
        </template>
    </Galleria>
</template>

<style>
.p-galleria-content {
    width: 60dvw;

    @media(width < 900px){
        width: 80dvw;
    }

    @media(width < 600px){
        width: 90dvw;
    }
}

.p-galleria-items-container {
    background-color: rgb(60,60,60);
}

.item-img {
    object-fit: contain;
    max-height: 70dvh;
}

.item-thumbnail {
    object-fit: contain;
    height: 100%;
    width: 100%;
}

</style>
