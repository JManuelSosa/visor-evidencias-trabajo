<script setup lang="ts">
import ToastLayout from './ToastLayout.vue';
import Navbar from './Navbar.vue';
</script>

<template>
    <ToastLayout>
        <main class="w-full min-h-screen flex flex-col md:flex-row bg-system-theme-50">
            <Navbar/>
            <section class="flex-1 overflow-y-auto min-h-0 p-6">
                <slot />
            </section>
        </main>
    </ToastLayout>
</template>
