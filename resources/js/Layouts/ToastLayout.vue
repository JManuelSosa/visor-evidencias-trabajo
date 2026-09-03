<script setup lang="ts">
import { watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { toast, Toaster } from 'vue-sonner';
import 'vue-sonner/style.css'

const page = usePage();

watch(() => page.props?.flash?.success, (message) => {
    if (message) toast.success(message);
});

watch(() => page.props?.flash?.error, (message) => {
    if (message) toast.error(message);
});

</script>

<template>
    <Toaster position="top-center" richColors closeButton closeButtonPosition="top-right" :expand="true" :visibleToasts="5"/>
    <slot></slot>
</template>
