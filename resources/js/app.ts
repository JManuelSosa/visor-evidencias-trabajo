// Plugins y librerias
import { createApp, h, type DefineComponent } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

//Prime Vue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { KeyFilter, Tooltip } from 'primevue';
import { definePreset } from '@primeuix/themes';


//Fonts
import '@fontsource-variable/montserrat/wght.css';
import '@fontsource-variable/open-sans/wdth.css';
import '@fontsource-variable/montserrat/wght-italic.css';
import '@fontsource-variable/open-sans/wdth-italic.css';

// css
import '../css/app.css';

// Iconos
import 'remixicon/fonts/remixicon.css';


const SystemTheme = definePreset(Aura, {
    semantic:{
        primary:{
            50: 'var(--color-system-theme-50)',
            100: 'var(--color-system-theme-100)',
            200: 'var(--color-system-theme-200)',
            300: 'var(--color-system-theme-300)',
            400: 'var(--color-system-theme-400)',
            500: 'var(--color-system-theme-500)',
            600: 'var(--color-system-theme-600)',
            700: 'var(--color-system-theme-700)',
            800: 'var(--color-system-theme-800)',
            900: 'var(--color-system-theme-900)',
            950: 'var(--color-system-theme-950)'
        }
    }
})

createInertiaApp({
    resolve:(name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob<DefineComponent>('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }){

        const app = createApp({ render: () => h(App, props)})
        .use(plugin)
        .use(PrimeVue, {
            theme: { preset:SystemTheme }
        });

        app.directive('keyfilter', KeyFilter);
        app.directive('tooltip', Tooltip);

        app.mount(el);
    }
})
