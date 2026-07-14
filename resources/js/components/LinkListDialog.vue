<script setup lang="ts">
import { Dialog, Button } from 'primevue';
import { ref } from 'vue';
import type { UrlItem } from '@/core/UrlItem';

interface DialogProps {
    urls:UrlItem[]
}
const props = defineProps<DialogProps>();
const visible = ref(false);

const emit = defineEmits<{ removeUrl:[id:string] }>();

function handleVisible(){
    visible.value = !visible.value;
}
</script>

<template>
    <Button variant="link" v-on:click="handleVisible" class="m-0! p-0!">Ver lista de enlaces</Button>
    <Dialog v-model:visible="visible" modal :closable=false class="w-full max-w-160 overflow-hidden" :pt="{ header: { class: 'p-0! overflow-hidden'}, content:{ class: 'p-0!'}}">
        <template #header>
            <div class="text-center w-full bg-system-theme-200 py-4">
                <span class="text-system-theme-800 text-2xl font-semibold text-center">Enlaces agregados</span>
            </div>
        </template>

        <div class="p-5">
            <div class="flex flex-col gap-2.5 w-full">
                <div class="flex gap-5 text-text text-xl">
                    <span class="flex-1 text-center">Titulo</span>
                    <span class="flex-1 text-center">URL</span>
                    <span class="w-1/5 text-center">Accion</span>
                </div>
                <ol class="flex flex-col gap-1.5 max-h-[75dvh] overflow-y-auto">
                    <li v-for="url in urls" :key="url.internalId" class="w-full flex gap-5">
                        <span class="flex-1 truncate">{{ url.title }}</span>
                        <span class="flex-1 truncate">{{ url.url }}</span>
                        <span class="w-1/5 flex items-center justify-center">
                            <Button size="small" title="Eliminar enlace" @click="emit('removeUrl', url.internalId)">
                                <i class="ri-delete-bin-2-line"></i>
                            </Button>
                        </span>
                    </li>
                </ol>
            </div>

            <div class="mt-10 flex w-full justify-center">
                <Button v-on:click="handleVisible">
                    Cerrar
                </Button>
            </div>

        </div>

    </Dialog>
</template>

<style scoped>

:deep(div.pdialogheader){
    padding: 0px !important;
}

</style>
