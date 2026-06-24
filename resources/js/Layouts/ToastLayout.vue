<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css'
</script>

<template>
    <Toaster position="top-center" richColors closeButton closeButtonPosition="top-right"/>
    <slot></slot>
</template>
