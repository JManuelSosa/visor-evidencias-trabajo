<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Button } from 'primevue';
import GoBackButton from '@/components/atoms/GoBackButton.vue';
// Layouts
import MainLayout from '../../../Layouts/MainLayout.vue';

// Tipos
import { AnnouncementDTO } from '@/core/acl/announcements/AnnouncementDTO.ts';

import AnnouncementCard from '@/components/organisms/AnnouncementCard.vue';


defineOptions({ layout:MainLayout });

const props = defineProps<{
    announcements:{
        data:AnnouncementDTO[]
    }
}>();

console.log(props.announcements.data)

</script>

<template>
    <header class="flex justify-between mb-12 mt-6">
        <GoBackButton size="small" label="Inicio" href="/home" icon-tailwind-font-size="text-lg"></GoBackButton>
        <h1 class="text-system-theme-900 text-4xl font-semibold italic">Anuncios</h1>
        <Button :as="Link" href="anuncios/agregar">
            Crear anuncio
        </Button>
    </header>

    <div class="flex flex-col w-full md:w-4/5 mx-auto gap-20">
        <template v-for="announcement in props.announcements.data" :key="announcement.title">
            <AnnouncementCard
                :titulo="announcement.title"
                :autor="announcement.author"
                :contenido="announcement.content"
                :files="announcement.files"
            />
        </template>
    </div>
</template>
