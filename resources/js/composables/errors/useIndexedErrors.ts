import { ref, watch, type Ref } from "vue";

interface IdentifiableItem {
    id:string;
}

type ItemE = Ref<IdentifiableItem[]> | (() => IdentifiableItem[]);
type BackendErr = Ref<Record<string,string> | undefined> | (() => Record<string,string> | undefined);
export type IndexedErrorsMap<TField extends string = string> = Record<string,Partial<Record<TField, string>>>;

export function useIndexedErrors<TField extends string>(prefix:string, items:ItemE, backendErrors:BackendErr){

    const errorsById = ref<IndexedErrorsMap<TField>>({});
    const hasErrors = ref(false);

    watch(
        typeof backendErrors === 'function' ? backendErrors : () => backendErrors.value,
        (newErrors) => {

            if(!newErrors || Object.keys(newErrors).length === 0){
                errorsById.value = {}
                hasErrors.value = false;
                return;
            }

            const currentItems = typeof items === 'function' ? items() : items.value;
            const nextMap:Record<string, Partial<Record<TField, string>>> = {};
            const fullPrefix = `${prefix}.`;
            let errorCount = 0;

            for(const [key, message] of Object.entries(newErrors)){
                if(!key.startsWith(fullPrefix)) continue;

                const parts:string[] = key.split('.');
                const index:number = Number(parts[1]);
                const field:TField = parts[2] as TField;
                const targetItem:IdentifiableItem|undefined = currentItems[index];

                if(targetItem?.id && field) {

                    if(!nextMap[targetItem.id]) nextMap[targetItem.id] = {};

                    nextMap[targetItem.id][field] = message;
                    errorCount++;
                }
            }

            errorsById.value = nextMap;
            hasErrors.value = errorCount > 0;
        },
        { deep:true, immediate:true }
    );

    function cleanItemError(id:string){
        if(errorsById.value[id]){
            delete errorsById.value[id];
            hasErrors.value = Object.keys(errorsById.value).length > 0;
        }
    }

    function cleanAllErrors(){
        errorsById.value = {};
        hasErrors.value = false;
    }

    return {
        errorsById,
        hasErrors,
        cleanItemError,
        cleanAllErrors
    };
}
