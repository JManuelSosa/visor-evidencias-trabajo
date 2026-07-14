<script setup lang="ts">
import { ref, Ref } from 'vue';
import { UrlItem } from '@/core/UrlItem';
import LinkListDialog from '../LinkListDialog.vue';
import { InputText, Button } from 'primevue';
import { toast } from 'vue-sonner';
import { generateId } from '@/core/utils/GenerateID';

interface UrlFormSectionProps {
    readonly items:UrlItem[];
    readonly countLabel:string;
}

const props = withDefaults(defineProps<UrlFormSectionProps>(), {
    items: () => []
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
        internalId: generateId(),
        title: currentUrl.value.title,
        url: currentUrl.value.url
    }

    emit("addUrl", newUrl);

    currentUrl.value = { title: '', url: '' };
}

</script>

<template>
<fieldset class="flex flex-col p-4 gap-4 w-full items-center">
    <legend class="sr-only">Enlaces</legend>

    <div>
        <span v-if="props.items.length > 0" class="flex flex-col md:flex-row items-center md:gap-2.5">
            <span>Tienes {{ countLabel }}</span>
            <span> - </span>
            <LinkListDialog :urls="props.items" @remove-url="(id) => emit('removeUrl', id)"/>
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

    <Button v-on:click="addLink">Agregar</Button>


</fieldset>

</template>
