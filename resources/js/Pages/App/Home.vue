<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import Button from 'primevue/button';
import MainLayout from '../../Layouts/MainLayout.vue';
import Navbar from '../../Layouts/Navbar.vue';

defineOptions({ layout:MainLayout });
</script>

<template>
    <main class="w-full min-h-screen flex bg-system-theme-50">
        <Navbar/>
        <slot></slot>
    </main>
</template>
