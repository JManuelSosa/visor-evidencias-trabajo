<script setup lang="ts">
import { Button } from 'primevue';
import { Link } from '@inertiajs/vue3';

import MainLayout from '../../../Layouts/MainLayout.vue';

defineOptions({ layout:MainLayout });
</script>

<template>
    <h1>Panel de anuncios</h1>
    <Button :as="Link" href="anuncios/agregar">
        Crear anuncio
    </Button>
</template>
