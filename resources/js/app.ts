// Plugins y librerias
import { createApp, h, type DefineComponent } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

//Prime Vue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

//Fonts
import '@fontsource-variable/montserrat/wght-italic.css';
import '@fontsource-variable/open-sans/wdth-italic.css';

// css
import '../css/app.css';


const SystemTheme = definePreset(Aura, {
    semantic:{
        primary:{
            50: 'var(--base-50)',
            100: 'var(--base-100)',
            200: 'var(--base-200)',
            300: 'var(--base-300)',
            400: 'var(--base-400)',
            500: 'var(--base-500)',
            600: 'var(--base-600)',
            700: 'var(--base-700)',
            800: 'var(--base-800)',
            900: 'var(--base-900)',
            950: 'var(--base-950)'
        }
    }
})

createInertiaApp({
    resolve:(name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob<DefineComponent>('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }){
        createApp({ render: () => h(App, props)})
        .use(plugin)
        .use(PrimeVue, {
            theme: { preset:SystemTheme }
        })
        .mount(el);
    }
})
