<script setup lang="ts">
import { ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { Button } from 'primevue';

import NavDrawer from './NavDrawer.vue';
import type { NavItem } from '@/core/NavItem.ts';

const navItems:NavItem[] = [
    {
        id: 1,
        label: 'Evidencias',
        icon: 'ri-folder-5-fill',
        url: '/evidencias'
    },
    {
        id: 2,
        label: 'Anuncios generales',
        icon: 'ri-megaphone-fill',
        url: '/anuncios'
    },
    {
        id: 3,
        label: 'Mi perfil',
        icon: 'ri-account-circle-2-fill',
        url: '/perfil'
    }
];

const visibleDrawer = ref(false);
const currentPage = usePage();

</script>

<template>
    <nav class="bg-system-theme-800 w-16 mx-4 rounded-4xl my-2 shadow-card-2 text-white overflow-hidden md:sticky top-2 self-start flex flex-col md:h-[calc(100vh-1rem)]">
        <div id="nav-header">
            <Button variant="text" @click="() => visibleDrawer = !visibleDrawer" class="bg-system-theme-400 rounded-2xl w-16 h-18 flex items-center justify-center md:hidden! text-white! cursor-pointer z-30">
                <i class="ri-menu-fold-4-fill text-2xl"></i>
            </Button>
            <Link href="/home">
                <figure class="cursor-pointer hidden md:block h-18" v-tooltip.left="{ value:'Ir al inicio'}">
                    <img src="/images/edime_logo_bg_removed.avif" alt="Logo de Edime" class="bg-system-theme-400 rounded-2xl h-full w-full block object-cover object-center">
                </figure>
            </Link>
        </div>
        <ul class="flex-1 hidden md:block overflow-y-auto">
            <Link v-for="item in navItems" :key="item.id" v-tooltip.left="{ value: item.label , autoHide: false }" :href="item.url"
            :class="['h-16 flex justify-center items-center cursor-pointer', {
                'bg-system-theme-950 border-system-theme-400 text-white': currentPage.url.startsWith(item.url),
                'border-transparent text-system-theme-200 hover:bg-system-theme-700 hover:text-white': !currentPage.url.startsWith(item.url)
            }]"
            >
                <i v-bind:class="[item.icon, 'text-4xl', 'text-system-theme-50']"></i>
            </Link>
        </ul>
        <div class="h-16 shrink-0 rounded-4xl bg-system-theme-950 hidden md:block">
            <div class="h-16 flex justify-center items-center cursor-pointer" v-tooltip.left="{ value: 'Cerrar sesión', autoHide: false }">
                <i class="ri-logout-box-r-fill text-3xl text-system-theme-50"></i>
            </div>
        </div>
    </nav>
    <NavDrawer v-bind:items="navItems" v-model:visible-drawer="visibleDrawer"/>
</template>

<style>

</style>
