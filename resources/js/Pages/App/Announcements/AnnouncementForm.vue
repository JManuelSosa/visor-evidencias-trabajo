<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Button, InputText } from 'primevue';
import MainLayout from '../../../Layouts/MainLayout.vue';
import TextEditor from '../../../components/TextEditor.vue';
import { UrlItem } from '../../../core/UrlItem.js';
import LinkListDialog from '../../../components/LinkListDialog.vue';
import FileUpload from '../../../components/FileUpload.vue';

defineOptions({ layout:MainLayout });
const currentPage = usePage();

const content = ref('');
const mockUrl = ref<UrlItem[]>([]);

const linkMessage = computed(() => {

    let linkCount = mockUrl.value.length;

    if(linkCount === 1) return `${linkCount} enlace agregado`;

    return `${linkCount} enlaces agregados`;
});

const currentLink = ref({
    title: '',
    url: ''
});

function addLink(){

    if(currentLink.value.title.trim() === "" || currentLink.value.url.trim() === "") return;

    const newLink:UrlItem = {
        internalId: crypto.randomUUID(),
        title: currentLink.value.title,
        url: currentLink.value.url
    }


    mockUrl.value.push(newLink);
    currentLink.value = { title: "", url: "" };
}
</script>

<template>
    <section class="flex flex-col gap-6">
        <div class="flex md:flex-col gap-6 items-start">
            <Button variant="text">Regresar</Button>
            <h1 class="text-system-theme-900 text-4xl font-bold">Crear anuncio</h1>
        </div>
        <section class="bg-green-200 border-2 border-accent w-full rounded-4xl p-4.5 max-w-340 flex flex-col">
            <form class="flex flex-col lg:flex-row flex-1 min-h-0 gap-5">
                <fieldset class="bg-red-200 w-full lg:w-7/10 flex flex-col gap-1 min-w-0 min-h-0 lg:max-h-160 lg:self-start">
                    <legend class="text-center sr-only">Anuncio principal</legend>
                    <label class="w-1/2">
                        <span class="block mb-2">Titulo del anuncio</span>
                        <InputText fluid/>
                    </label>

                    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
                        <span class="block mb-2">Contenido del anuncio</span>
                        <div class="flex-1 min-h-0 overflow-y-auto">
                            <TextEditor v-model="content"/>
                        </div>
                    </div>
                </fieldset>

                <div class="flex flex-col flex-1">
                    <fieldset class="bg-blue-200 self-start w-full">
                        <legend class="sr-only">Links</legend>
                        <span>Enlaces</span>

                        <div class="flex gap-5 flex-col">
                            <Label>
                                <span>Titulo del enlace</span>
                                <InputText fluid v-model="currentLink.title"/>
                            </Label>
                            <div class="flex gap-5">
                                <label class="w-6/10">
                                    <span>Link</span>
                                    <InputText fluid v-model="currentLink.url"/>
                                </label>
                                <Button class="self-end" v-on:click="addLink">Agregar</Button>
                            </div>
                        </div>

                        <div>
                            <span v-if="mockUrl.length > 0">
                                {{ linkMessage }}
                                <LinkListDialog :urls="mockUrl"/>
                            </span>
                            <span v-else>
                                Sin enlaces agregados
                            </span>

                        </div>




                    </fieldset>

                    <fieldset class="bg-pink-200 self-start w-full">
                        <legend class="sr-only">Archivos</legend>
                        <span>Archivos</span>

                    </fieldset>
                </div>


            </form>
        </section>

    </section>
    <div class="h-40 w-70 self-center">
        <FileUpload/>
    </div>

</template>

<style scoped>
/* .p-editor-container {
    display: flex !important;
    flex-direction: column !important;
    min-height: 0 !important;
    min-width: 0 !important;
}

.p-editor-content {
    flex: 1 1 auto !important;
    min-height: 0 !important;
    min-width: 0 !important;
    overflow: hidden !important;
}

.ql-editor {
    height: 100% !important;
    overflow-y: auto !important;
    word-break: break-all !important;
    overflow-wrap: anywhere !important;
} */
</style>
