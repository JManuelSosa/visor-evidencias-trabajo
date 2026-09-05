<script setup lang="ts">
import { Dialog, Button } from 'primevue';
import { ref, computed, watch } from 'vue';
import type { UrlItem } from '@/core/UrlItem';
import type { IndexedErrorsMap } from '@/composables/errors/useIndexedErrors';

interface DialogProps {
    urls:UrlItem[],
    errorsById?:IndexedErrorsMap<'url'|'title'>;
    isProcessing:boolean;
}
const props = withDefaults(defineProps<DialogProps>(), {
    errorsById: () => ({}),
});

const visible = ref(false);

const emit = defineEmits<{ removeUrl:[id:string] }>();

function handleVisible(){
    visible.value = !visible.value;
}
</script>

<template>
    <Button variant="link" v-on:click="handleVisible" :disabled="isProcessing" class="m-0! p-0!">Ver lista de enlaces</Button>
    <Dialog v-model:visible="visible" modal :closable=false class="w-full max-w-160 overflow-hidden" :pt="{ header: { class: 'p-0! overflow-hidden'}, content:{ class: 'p-0!'}}">
        <template #header>
            <div class="text-center w-full bg-system-theme-200 py-4">
                <span class="text-system-theme-800 text-2xl font-semibold text-center">Enlaces agregados</span>
            </div>
        </template>

        <div class="p-5">
            <div class="flex flex-col gap-2.5 w-full">
                <div class="flex gap-5 text-text text-xl">
                    <span class="flex-1 text-center rounded-lg">Titulo</span>
                    <span class="flex-1 text-center rounded-lg">URL</span>
                    <span class="w-1/5 text-center rounded-lg">Accion</span>
                </div>
                <ol class="flex flex-col gap-1.5 max-h-[75dvh] overflow-y-auto">
                    <li v-for="url in urls" :key="url.id" class="w-full flex flex-col">
                        <div class="w-full flex gap-5 items-center" :class="{'bg-red-50 text-red-600': errorsById[url.id]}">
                            <span class="flex-1 truncate text-center">{{ url.title }}</span>
                            <span class="flex-1 truncate text-center">{{ url.url }}</span>
                            <span class="w-1/5 flex items-center justify-center">
                                <Button size="small" title="Eliminar enlace" @click="emit('removeUrl', url.id)">
                                    <i class="ri-delete-bin-2-line"></i>
                                </Button>
                            </span>
                        </div>
                        <div v-if="errorsById[url.id]" class="text-xs flex p-1">
                            <div class="flex flex-col flex-1">
                                <ul v-for="(msg, field) in errorsById[url.id]" :key="field">
                                    <li class="block text-red-600 text-center"> - {{ msg }}</li>
                                </ul>
                            </div>
                        </div>

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
