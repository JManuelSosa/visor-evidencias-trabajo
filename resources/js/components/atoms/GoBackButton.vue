<script setup lang="ts">
import { Button } from 'primevue';
import { Link } from '@inertiajs/vue3';

const props = defineProps<{
    size?:'small'|'large';
    href:string;
    label:string;
    iconTailwindFontSize?:string
    labelClass?:string
}>();

</script>

<template>
    <Button :size="size" rounded :as="Link" :href="href">
        <i :class="['ri-arrow-left-s-line', iconTailwindFontSize]""></i>
        <span :class="labelClass">{{ label }}</span>
    </Button>
</template>

