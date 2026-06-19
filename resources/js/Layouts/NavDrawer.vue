<script setup lang="ts">
import { computed } from 'vue';
import { Drawer, Avatar, Button } from 'primevue';
import { NavItem } from '../core/NavItem';

import Logo from '../components/Logo.vue';

const DrawerProps = defineProps<{
    items:NavItem[],
    visibleDrawer:boolean
}>();

const emit = defineEmits(['update:visibleDrawer']);
const isVisible = computed({
    get: () => DrawerProps.visibleDrawer,
    set: (value) => emit('update:visibleDrawer', value)
});

</script>

<template>
    <Drawer v-model:visible="isVisible">
        <template #container="{ closeCallback }">
            <div class="bg-system-theme-50 h-full flex flex-col items-center">
                <div class="flex justify-end w-full px-3">
                    <Button type="button" @click="closeCallback" rounded variant="outlined">
                        <i class="ri-close-fill text-xl"></i>
                    </Button>
                </div>

                <div class="mb-12">
                    <Logo/>
                </div>

                <ul class="flex-1 w-full px-5 flex flex-col items-center">
                    <li v-for="item in items" :key="item.id" class="w-full text-xl hover:bg-system-theme-200 active:bg-system-theme-200 rounded-xl p-3 cursor-pointer">
                        <i v-bind:class="[item.icon, 'text-4xl']"></i> {{ item.label }}
                    </li>
                </ul>

                <div class="w-full border-none flex">
                    <Avatar label="P" size="xlarge"/>
                    <div class="bg-system-theme-200 text-center flex-1 py-1">
                        <span class="block text-sm text-system-theme-900">Bienvenido:</span>
                        <span class="m-auto text-system-theme-950 font-bold">José Manuel Vázquez Sosa</span>
                    </div>

                </div>
            </div>
        </template>
    </Drawer>
</template>
