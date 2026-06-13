// Plugins y librerias
import { createApp, h, type DefineComponent } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

//Prime Vue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

//Fonts
import '@fontsource-variable/montserrat/wght-italic.css';
import '@fontsource-variable/open-sans/wdth-italic.css';

// css
import '../css/app.css';

createInertiaApp({
    resolve:(name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob<DefineComponent>('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }){
        createApp({ render: () => h(App, props)})
        .use(plugin)
        .use(PrimeVue, {
            theme: { preset:Aura }
        })
        .mount(el);
    }
})
