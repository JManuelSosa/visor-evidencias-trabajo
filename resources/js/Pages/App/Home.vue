<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import Button from 'primevue/button';
import PluginLayout from '../../Layouts/PluginLayout.vue';

defineOptions({ layout:PluginLayout });
</script>

<template>
    <Head title="Inicio - Sistema de Reportes" />

    <main class="w-full min-h-screen flex items-center justify-center bg-background p-4">

        <div class="bg-surface p-10 rounded-2xl shadow-card border border-border w-full max-w-2xl text-center flex flex-col gap-6 items-center">

            <i class="ri-checkbox-circle-fill text-6xl text-green-500"></i>

            <div class="flex flex-col gap-2">
                <h1 class="font-heading text-3xl font-bold text-text">¡Autenticación Exitosa!</h1>
                <p class="text-text/75 text-lg text-balance">
                    Has ingresado correctamente al panel principal del sistema de reportes.
                </p>
            </div>

            <Link href="/logout" method="post" as="button" class="mt-4">
                <Button severity="danger" variant="outlined" icon="ri-logout-box-line" label="Cerrar sesión" />
            </Link>

        </div>

    </main>
</template>
