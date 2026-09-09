<script setup lang="ts">
import { Button } from 'primevue';
import { Link } from '@inertiajs/vue3';
import { usePage } from '@inertiajs/vue3';

import MainLayout from '../../../Layouts/MainLayout.vue';

defineOptions({ layout:MainLayout });

const page = usePage();
console.log(page.props.announcements);
</script>

<template>
    <h1>Panel de anuncios</h1>
    <Button :as="Link" href="anuncios/agregar">
        Crear anuncio
    </Button>
    <pre>
        {{ page.props.announcements }}
    </pre>
</template>
