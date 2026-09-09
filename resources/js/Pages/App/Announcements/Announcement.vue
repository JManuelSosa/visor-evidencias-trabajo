<script setup lang="ts">
import { Button } from 'primevue';
import { Link } from '@inertiajs/vue3';

// Layouts
import MainLayout from '../../../Layouts/MainLayout.vue';

// Tipos
import { AnnouncementDTO } from '@/core/acl/announcements/AnnouncementDTO.ts';


defineOptions({ layout:MainLayout });

const props = defineProps<{
    announcements:AnnouncementDTO[]
}>();

</script>

<template>
    <h1>Panel de anuncios</h1>
    <Button :as="Link" href="anuncios/agregar">
        Crear anuncio
    </Button>
    <pre>
        {{ props.announcements }}
    </pre>
</template>
