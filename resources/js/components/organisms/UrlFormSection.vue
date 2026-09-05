<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import { UrlItem } from '@/core/UrlItem';
import LinkListDialog from '../LinkListDialog.vue';
import { InputText, Button } from 'primevue';
import { toast } from 'vue-sonner';
import { generateId } from '@/core/utils/GenerateID';
import { useIndexedErrors } from '@/composables/errors/useIndexedErrors.ts';

interface UrlFormSectionProps {
    readonly items:UrlItem[];
    readonly countLabel:string;
    readonly errors?:Record<string,string>;
    readonly isProcessing:boolean;
}

const props = withDefaults(defineProps<UrlFormSectionProps>(), {
    items: () => [],
    errors: () => ({})
});

interface FormUrl {
    title:string;
    url:string;
}

const currentUrl:Ref<FormUrl> = ref({
    title: '',
    url: ''
});

const emit = defineEmits<{
    addUrl: [url: UrlItem];
    removeUrl: [id: string];
}>();


function addLink(){

    if(currentUrl.value.title.trim() === "" || currentUrl.value.url.trim() === ""){
        toast.warning("Tienes que completar todos los campos", { duration:3000 });
        return;
    }

    const newUrl:UrlItem = {
        id: generateId(),
        title: currentUrl.value.title,
        url: currentUrl.value.url
    }

    emit("addUrl", newUrl);

    currentUrl.value = { title: '', url: '' };
}

// Manejo de errores
const { errorsById, cleanItemError, hasErrors } = useIndexedErrors<'url'|'title'>('urls', () => props.items, () => props.errors);

function handleRemoveUrl(internalId:string){
    cleanItemError(internalId);
    emit('removeUrl', internalId);
}
</script>

<template>
<fieldset class="flex flex-col p-4 gap-4 w-full items-center">
    <legend class="sr-only">Enlaces</legend>

    <div>
        <span v-if="hasErrors" class="block mx-auto text-center text-red-600">Uno o más enlaces son erróneos, eliminelos e ingrese enlaces válidos</span>
        <span v-if="props.items.length > 0" class="flex flex-col md:flex-row items-center md:gap-2.5">
            <span>Tienes {{ countLabel }}</span>
            <span> - </span>
            <LinkListDialog :urls="props.items" :errors-by-id="errorsById" :is-processing="isProcessing" @remove-url="handleRemoveUrl"/>
        </span>
        <span v-else>
            Todavía no has agregado ningun enlace
        </span>
    </div>

    <div class="flex flex-col md:flex-row gap-5 w-full">
        <label class="flex-1 flex flex-col md:flex-row items-center gap-1.5 md:gap-4">
            <span class="shrink-0">Titulo del enlace</span>
            <InputText fluid v-model="currentUrl.title"/>
        </label>

        <label class="flex-1 flex flex-col md:flex-row items-center gap-1.5 md:gap-4">
            <span class="shrink-0">Enlace (Url)</span>
            <InputText fluid v-model="currentUrl.url"/>
        </label>
    </div>

    <Button v-on:click="addLink" :disabled="isProcessing">Agregar</Button>


</fieldset>

</template>
