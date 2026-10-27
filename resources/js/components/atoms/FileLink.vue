<script setup lang="ts">
import type { FileType } from '@/core/acl/announcements/AnnouncementFile';
import { Button } from 'primevue';

const props = defineProps<{
    url:string;
    fileType:FileType;
    title:string;
}>();

const IconFiles:Partial<Record<FileType, { icon:string; color:string }>> = {
    pdf: {
        icon: 'ri-file-pdf-2-fill',
        color: 'text-red-700'
    },
    document: {
        icon: 'ri-file-word-fill',
        color: 'text-blue-700'
    },
    spreadsheet: {
        icon: 'ri-file-excel-fill',
        color: 'text-green-600'
    },
    presentation: {
        icon: 'ri-file-ppt-fill',
        color: 'text-orange-600'
    }
}
</script>

<template>
    <li class="flex items-center">
        <i class="text-3xl" :class="[IconFiles[fileType]?.icon, IconFiles[fileType]?.color]"></i>
        <Button as="a" :href="url" target="_blank" rel="noopener" variant="link" class="text-system-theme-800! text-sm! hover:underline!">{{ title }}</Button>
    </li>
</template>
