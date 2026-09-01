<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button, Select, Popover } from 'primevue';
import DOMPurify from 'dompurify';

const editorProps = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: "Escribe algo..." },
    minHeight: { type: String, default: '200px' }
});

const emit = defineEmits(['update:modelValue']);

const currentTextType = ref('paragraph');
const popoverRef = ref(); // Ref para el Popover

const editor = useEditor({
    content: editorProps.modelValue,
    extensions: [
        StarterKit.configure({
            blockquote:false,
            code:false,
            codeBlock:false
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Underline
    ],
    onUpdate: ({ editor }) => {

        const rawHTML = editor.getHTML();
        const cleanHTML = DOMPurify.sanitize(rawHTML, {
            ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'hr', 'br'],
            ALLOWED_ATTR: ['style'],
            ALLOW_DATA_ATTR: false,
        });
        emit('update:modelValue', cleanHTML);
    },
    onTransaction: () => { currentTextType.value = getCurrentTextType(); },
    editorProps: {
        attributes: {
            class: 'tiptap-editor focus:outline-none p-4 bg-white',
            style: `min-height: ${editorProps.minHeight}`
        }
    }
});

const textTypes = [
    { label: 'Título', value: 'heading-1', changeType: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Subtítulo 1', value: 'heading-2', changeType: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Subtítulo 2', value: 'heading-3', changeType: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Párrafo', value: 'paragraph', changeType: () => editor.value?.chain().focus().setParagraph().run() },
];

const formatButtons = [
    { clickFn: () => editor.value?.chain().focus().toggleBold().run(), severity: 'bold', icon: 'ri-bold', label: 'Negrita' },
    { clickFn: () => editor.value?.chain().focus().toggleItalic().run(), severity: 'italic', icon: 'ri-italic', label: 'Itálica' },
    { clickFn: () => editor.value?.chain().focus().toggleUnderline().run(), severity: 'underline', icon: 'ri-underline', label: 'Subrayado' },
    { clickFn: () => editor.value?.chain().focus().toggleStrike().run(), severity: 'strike', icon: 'ri-strikethrough', label: 'Tachado' },
];

const alignButtons = [
    { clickFn: () => editor.value?.chain().focus().setTextAlign('left').run(), align: 'left', icon: 'ri-align-left', label: 'Izquierda' },
    { clickFn: () => editor.value?.chain().focus().setTextAlign('center').run(), align: 'center', icon: 'ri-align-center', label: 'Centro' },
    { clickFn: () => editor.value?.chain().focus().setTextAlign('right').run(), align: 'right', icon: 'ri-align-right', label: 'Derecha' },
    { clickFn: () => editor.value?.chain().focus().setTextAlign('justify').run(), align: 'justify', icon: 'ri-align-justify', label: 'Justificado' },
];

const listButtons = [
    { clickFn: () => editor.value?.chain().focus().toggleBulletList().run(), type: 'bulletList', icon: 'ri-list-unordered', label: 'Lista con viñetas' },
    { clickFn: () => editor.value?.chain().focus().toggleOrderedList().run(), type: 'orderedList', icon: 'ri-list-ordered', label: 'Lista numerada' },
];

const otherButtons = [
    { clickFn: () => editor.value?.chain().focus().setHorizontalRule().run(), icon: 'ri-separator', label: 'Línea horizontal' },
];

const historyButtons = [
    { clickFn: () => editor.value?.chain().focus().undo().run(), icon: 'ri-arrow-go-back-line', disabled: () => !editor.value?.can().undo(), label: 'Deshacer' },
    { clickFn: () => editor.value?.chain().focus().redo().run(), icon: 'ri-arrow-go-forward-line', disabled: () => !editor.value?.can().redo(), label: 'Rehacer' },
];

function setTextType(type: string) {
    if (!editor.value) return;
    const newType = textTypes.find(e => e.value === type);
    newType?.changeType();
}

function getCurrentTextType() {
    if (!editor.value) return 'paragraph';
    if (editor.value.isActive('heading', { level: 1 })) return 'heading-1';
    if (editor.value.isActive('heading', { level: 2 })) return 'heading-2';
    if (editor.value.isActive('heading', { level: 3 })) return 'heading-3';
    return 'paragraph';
}

// API correcta de PrimeVue 4 para Popover
function toggleMoreMenu(event: Event) {
    popoverRef.value?.toggle(event);
}

function executeAndClose(clickFn: () => void) {
    clickFn();
    popoverRef.value?.hide();
    editor.value?.commands.focus();
}

watch(() => editorProps.modelValue, (value) => {
    const isSameContent = editor.value?.getHTML() === value;
    if (!isSameContent) {
        editor.value?.commands.setContent(value);
    }
});
</script>

<template>
    <div v-bind="$attrs" class="tiptap-editor-wrapper">
        <!-- Toolbar -->
        <div class="tiptap-toolbar flex flex-wrap items-center gap-1 sm:gap-2 p-2 border-b border-gray-300 bg-gray-50 rounded-t-md shrink-0" v-if="editor">

            <!-- Select de tipo de texto -->
            <Select
                :modelValue="currentTextType"
                @update:modelValue="setTextType"
                :options="textTypes"
                optionLabel="label"
                optionValue="value"
                size="small"
                placeholder="Formato"
                class="w-28 sm:w-36 md:w-40"
            />

            <!-- Opciones de móvil  -->
            <Button
                type="button"
                icon="ri-more-2-fill"
                size="small"
                text
                severity="secondary"
                class="md:hidden"
                @click="toggleMoreMenu"
                aria-label="Más opciones"
            />

            <!-- Popover -->
            <Popover ref="popoverRef" class="tiptap-more-menu">
                <div class="flex flex-col gap-3 p-2 min-w-50">
                    <!-- Formato -->
                    <div>
                        <div class="text-xs font-semibold text-gray-500 uppercase mb-1 px-2">Formato</div>
                        <div class="flex flex-wrap gap-1">
                            <Button
                                v-for="button in formatButtons"
                                :key="button.icon"
                                type="button"
                                @click="executeAndClose(button.clickFn)"
                                :severity="editor.isActive(button.severity) ? 'primary' : 'secondary'"
                                size="small"
                                text
                                :title="button.label"
                            >
                                <i :class="button.icon"></i>
                            </Button>
                        </div>
                    </div>

                    <!-- Alineación -->
                    <div>
                        <div class="text-xs font-semibold text-gray-500 uppercase mb-1 px-2">Alineación</div>
                        <div class="flex flex-wrap gap-1">
                            <Button
                                v-for="button in alignButtons"
                                :key="button.icon"
                                type="button"
                                @click="executeAndClose(button.clickFn)"
                                :severity="editor.isActive({ textAlign: button.align }) ? 'primary' : 'secondary'"
                                size="small"
                                text
                                :title="button.label"
                            >
                                <i :class="button.icon"></i>
                            </Button>
                        </div>
                    </div>

                    <!-- Listas -->
                    <div>
                        <div class="text-xs font-semibold text-gray-500 uppercase mb-1 px-2">Listas</div>
                        <div class="flex flex-wrap gap-1">
                            <Button
                                v-for="button in listButtons"
                                :key="button.icon"
                                type="button"
                                @click="executeAndClose(button.clickFn)"
                                :severity="editor.isActive(button.type) ? 'primary' : 'secondary'"
                                size="small"
                                text
                                :title="button.label"
                            >
                                <i :class="button.icon"></i>
                            </Button>
                        </div>
                    </div>

                    <!-- Otros -->
                    <div>
                        <div class="text-xs font-semibold text-gray-500 uppercase mb-1 px-2">Otros</div>
                        <div class="flex flex-wrap gap-1">
                            <Button
                                v-for="button in otherButtons"
                                :key="button.icon"
                                type="button"
                                @click="executeAndClose(button.clickFn)"
                                size="small"
                                text
                                :title="button.label"
                            >
                                <i :class="button.icon"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </Popover>

            <!-- Separador -->
            <div class="hidden md:block w-px bg-gray-300 mx-1"></div>

            <!-- Formato -->
            <div class="hidden md:flex items-center gap-1">
                <Button
                    v-for="button in formatButtons"
                    :key="button.icon"
                    type="button"
                    @click="button.clickFn"
                    :severity="editor.isActive(button.severity) ? 'primary' : 'secondary'"
                    size="small"
                    text
                    :title="button.label"
                >
                    <i :class="button.icon"></i>
                </Button>
            </div>

            <div class="hidden md:block w-px bg-gray-300 mx-1"></div>

            <!-- Alineación -->
            <div class="hidden md:flex items-center gap-1">
                <Button
                    v-for="button in alignButtons"
                    :key="button.icon"
                    type="button"
                    @click="button.clickFn"
                    :severity="editor.isActive({ textAlign: button.align }) ? 'primary' : 'secondary'"
                    size="small"
                    text
                    :title="button.label"
                >
                    <i :class="button.icon"></i>
                </Button>
            </div>

            <div class="hidden md:block w-px bg-gray-300 mx-1"></div>

            <!-- Listas -->
            <div class="hidden md:flex items-center gap-1">
                <Button
                    v-for="button in listButtons"
                    :key="button.icon"
                    type="button"
                    @click="button.clickFn"
                    :severity="editor.isActive(button.type) ? 'primary' : 'secondary'"
                    size="small"
                    text
                    :title="button.label"
                >
                    <i :class="button.icon"></i>
                </Button>
            </div>

            <div class="hidden md:block w-px bg-gray-300 mx-1"></div>

            <!-- Otros -->
            <div class="hidden md:flex items-center gap-1">
                <Button
                    v-for="button in otherButtons"
                    :key="button.icon"
                    type="button"
                    @click="button.clickFn"
                    size="small"
                    text
                    :title="button.label"
                >
                    <i :class="button.icon"></i>
                </Button>
            </div>

            <!-- Spacer móvil -->
            <div class="flex-1 md:hidden"></div>

            <!-- Historial -->
            <div class="flex items-center gap-1">
                <Button
                    v-for="button in historyButtons"
                    :key="button.icon"
                    type="button"
                    @click="button.clickFn"
                    :disabled="button.disabled()"
                    size="small"
                    text
                    :title="button.label"
                >
                    <i :class="button.icon"></i>
                </Button>
            </div>
        </div>

        <div class="tiptap-content-wrapper flex-1 overflow-y-auto">
            <EditorContent :editor="editor" />
        </div>
    </div>
</template>

<style>
.tiptap-editor-wrapper {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
}

.tiptap-content-wrapper {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.tiptap-editor {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #374151;
    height: 100%;
    min-height: 100%;
}

.tiptap-editor h1 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.8em 0 0.4em;
    line-height: 1.3;
}

.tiptap-editor h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0.7em 0 0.35em;
    line-height: 1.35;
}

.tiptap-editor h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.6em 0 0.3em;
    line-height: 1.4;
}

.tiptap-editor p {
    margin-bottom: 0.6em;
}

.tiptap-editor ul,
.tiptap-editor ol {
    padding-left: 1.5em;
    margin-bottom: 0.6em;
}

.tiptap-editor ul {
    list-style-type: disc;
}

.tiptap-editor ol {
    list-style-type: decimal;
}

.tiptap-editor li {
    margin-bottom: 0.2em;
}

.tiptap-editor hr {
    border: 0;
    border-top: 2px solid #e5e7eb;
    margin: 1.2em 0;
}
</style>
