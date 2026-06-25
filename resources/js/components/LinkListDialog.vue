<script setup lang="ts">
import { Dialog, Button } from 'primevue';
import { ref } from 'vue';
import type { UrlItem } from '@/core/UrlItem';

interface DialogProps {
    urls:UrlItem[]
}
const props = defineProps<DialogProps>();
const visible = ref(false);

function handleVisible(){
    visible.value = !visible.value;
}
</script>

<template>
    <Button variant="link" v-on:click="handleVisible" class="m-0! p-0!">Ver lista de enlaces</Button>
    <Dialog v-model:visible="visible" modal :closable=false class="w-full max-w-160">
        <template #header>
            <div class="border-b-2 border-b-system-theme-200 w-6/7 pb-2">
                <span class="text-system-theme-800 text-2xl font-semibold text-center">Enlaces agregados</span>
            </div>
        </template>

        <div class="flex flex-col gap-2.5">
            <div class="flex gap-5 text-text text-xl">
                <span class="flex-1">Titulo</span>
                <span class="flex-1">URL</span>
            </div>
            <ol class="flex flex-col gap-1.5">
                <li v-for="url in urls" :key="url.internalId" class="w-full flex gap-5">
                    <span class="flex-1 truncate">{{ url.title }}</span>
                    <span class="flex-1 truncate">{{ url.url }}</span>
                </li>
            </ol>
        </div>

        <div class="mt-10 flex w-full justify-center">
            <Button v-on:click="handleVisible">
                Cerrar
            </Button>
        </div>

    </Dialog>
</template>
