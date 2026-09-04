<script setup lang="ts">
import { Button, InputText, Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primevue';
import MainLayout from '@/Layouts/MainLayout.vue';
import TextEditor from '@/components/TextEditor.vue';
import { UrlItem } from '@/core/UrlItem';
import { Link } from '@inertiajs/vue3';

import type { FileItem } from '@/core/FileItem';
import type { AnnouncementFilePayload } from '@/core/files/AnnouncementFilePayload';

import { useUrls } from '@/composables/useUrls';
import UrlFormSection from '@/components/organisms/UrlFormSection.vue';

import FilesFormSection from '@/components/organisms/FilesFormSection.vue';
import { useFiles } from '@/composables/useFiles';

import { useForm } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';

import { ContextType } from '@/core/files/ContextType';
import { useUploadTracker } from '@/composables/files/useUploadTracker';

defineOptions({ layout:MainLayout });

const { listUrl, counterLabel, counterUrl, addUrl, removeUrl, clearUrlList } = useUrls();
const { files, counterFiles, removeFile, setFiles, setTitle, clearFileList } = useFiles();

const context:ContextType = "announcement";

const form = useForm({
    title: '',
    content: '',
    urls: [] as UrlItem[],
    files: [] as AnnouncementFilePayload[]
});

function submitAnnouncement(){

    const formIsValid:boolean = validateFormFields();
    if(!formIsValid) return;

    form.transform((data) => ({
        ...data,
        urls: listUrl.value,
        files: files.value.map((file, index) => ({
            file_id: file.fileId,
            title: file.title as string,
            description: file?.description ?? '',
            sort_order: index + 1
        }))
    })).post('/anuncios/agregar', {
        preserveScroll: true,
        onSuccess: () => {
            clearForm();
            form.reset();
        }
    })
    console.log(form);
}

function clearForm(){
    clearFileList();
    clearUrlList();
}

function validateFormFields():boolean {

    if(form.title.trim() === ''){
        toast.warning('El titulo del anuncio es obligatorio');
        return false;
    }

    if(form.content.trim() === ''){
        toast.warning('El anuncio tiene que tener contenido');
        return false;
    }

    const invalidFile = files.value.find(f => !f.title || f.title.trim() === '');

    if(invalidFile) {
        toast.warning(`Debes asignarle un título al archivo: ${invalidFile.name}`);
        return false;
    }

    const activeUploads = useUploadTracker.getActiveUploads();

    if(activeUploads.length > 0){
        toast.warning('Aún hay archivos en proceso de subida, debes esperar a que terminen');
        return false;
    }

    return true;
}


</script>

<template>
    <section class="flex flex-col gap-6">
        <div class="flex md:flex-col gap-6 items-start">
            <Button size="small" rounded :as="Link" href="/anuncios">
                <i class="ri-arrow-left-s-line"></i>
                Volver
            </Button>
            <h1 class="text-system-theme-900 text-4xl font-bold">Crear anuncio</h1>
        </div>


        <section class=" w-11/12 self-center rounded-4xl max-w-340 flex flex-col">
            <form class="flex flex-col flex-1 min-h-0 gap-5" @submit.prevent="submitAnnouncement">
                <fieldset class="bg-system-theme-200 border border-system-theme-300 w-full flex flex-col gap-5 min-w-0 min-h-0 h-140 lg:self-start shadow-card-1 rounded-2xl p-4 md:p-8">
                    <legend class="text-center sr-only">Anuncio principal</legend>
                    <label class="flex flex-col md:flex-row md:gap-5 items-center">
                        <span class="block mb-2 shrink-0">Titulo del anuncio</span>
                        <InputText fluid v-model="form.title"/>
                    </label>

                    <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
                        <span class="block mb-2 self-center">Contenido del anuncio</span>
                        <div class="flex-1 min-h-0 md:w-8/9 overflow-y-auto md:self-center">
                            <TextEditor v-model="form.content"/>
                        </div>
                    </div>
                </fieldset>

                <div class="flex-1 min-h-0 flex flex-col">
                    <Accordion value="0" class="bg-system-theme-200 rounded-lg border border-system-theme-300 overflow-hidden">

                        <AccordionPanel value="0">
                            <AccordionHeader class="w-full flex justify-between bg-system-theme-300 p-4 border-b border-system-theme-400 overflow-hidden">
                                <span>Enlaces ({{ counterUrl }})</span>
                            </AccordionHeader>
                            <AccordionContent>
                                <UrlFormSection :items="listUrl" :count-label="counterLabel" v-on:add-url="addUrl" v-on:remove-url="removeUrl"/>
                            </AccordionContent>
                        </AccordionPanel>


                    <AccordionPanel value="1">

                        <AccordionHeader>Archivos subidos ({{ files.length }})</AccordionHeader>
                        <AccordionContent>
                            <FilesFormSection
                                :files="files"
                                :file-counter="counterFiles"
                                :context="context"
                                @update:files="setFiles"
                                @update:title="setTitle"
                                @remove="removeFile"
                            />
                        </AccordionContent>
                    </AccordionPanel>



                </Accordion>
                </div>

                <Button type="submit" :loading="form.processing">
                    Crear anuncio
                </Button>
            </form>
        </section>

    </section>
</template>

<style scoped>

:deep(.p-accordionheader){
    background-color: var(--color-system-theme-300) !important;
    color: var(--color-system-theme-950) !important;
}

:deep(.p-accordioncontent-wrapper){
    width: 100%;
    min-width: 0;
    overflow:hidden;
}

:deep(.p-accordioncontent-content){
    padding: 0 !important;
    background-color: var(--color-system-theme-100);
}

</style>
