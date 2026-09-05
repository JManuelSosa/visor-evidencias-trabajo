import { ref, computed, type Ref, type ComputedRef } from "vue";
import { UrlItem } from "@/core/UrlItem";
import { toast } from "vue-sonner";

export function useUrls(){

    const listUrl:Ref<UrlItem[]> = ref([]);
    const counterUrl:ComputedRef<number> = computed(() => listUrl.value.length);

    const counterLabel:ComputedRef<string> = computed(() => {
        let urlCounter:number = listUrl.value.length;
        if(urlCounter === 1) return `${urlCounter} enlace agregado`;

        return `${urlCounter} enlaces agregados`;
    });

    function addUrl(url:UrlItem) {

        if(isDuplicate(url)){
            toast.warning('Ya has agregado este enlace, no puedes agregarlo 2 veces', { duration: 3000 });
            return;
        }

        listUrl.value.push(url);
    }

    function removeUrl(id:string) {
        if(!id) return;

        listUrl.value = listUrl.value.filter(url => url.id !== id);
    }

    function isDuplicate(url:UrlItem){
        return listUrl.value.some(e => e.url === url.url);
    }

    function clearUrlList():void {
        listUrl.value = [];
    }

    return { listUrl, counterUrl, counterLabel, addUrl, removeUrl, clearUrlList }
}
