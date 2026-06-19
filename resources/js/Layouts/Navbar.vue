<script setup lang="ts">
import { ref } from 'vue';

import NavDrawer from './NavDrawer.vue';
import { NavItem } from '../core/NavItem';

const navItems:NavItem[] = [
    {
        id:1,
        label: 'Evidencias',
        icon: 'ri-folder-5-fill'
    },
    {
        id:2,
        label: 'Anuncios generales',
        icon: 'ri-megaphone-fill'
    },
    {
        id:3,
        label: 'Mi perfil',
        icon: 'ri-account-circle-2-fill'
    }
];

const visibleDrawer = ref(false);
</script>

<template>
    <nav class="bg-system-theme-800 w-16 mx-4 rounded-4xl my-2 shadow-card-2 text-white overflow-hidden sticky flex flex-col h-fit md:h-auto">
        <div id="nav-header">
            <Button variant="text" @click="() => visibleDrawer = !visibleDrawer" class="bg-system-theme-400 rounded-2xl w-16 h-18 flex items-center justify-center md:hidden cursor-pointer">
                <i class="ri-menu-fold-4-fill text-2xl"></i>
            </Button>
            <figure class="cursor-pointer hidden md:block h-18" v-tooltip.left="{ value:'Ir al inicio'}">
                <img src="/images/edime_logo_bg_removed.avif" alt="Logo de Edime" class="bg-system-theme-400 rounded-2xl h-full w-full block object-cover object-center">
            </figure>
        </div>
        <ul class="flex-1 hidden md:block">
            <li v-for="item in navItems" :key="item.id" v-tooltip.left="{ value: item.label , autoHide: false }" class="h-16 flex justify-center items-center cursor-pointer">
                <i v-bind:class="[item.icon, 'text-4xl', 'text-system-theme-50']"></i>
            </li>
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
