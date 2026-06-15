<script setup lang="ts">
// Vue
import { computed, ComputedRef } from 'vue';

// Inertia
import { Link, useForm } from '@inertiajs/vue3';

// Componentes
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';

// Toast
import PluginLayout from '../../Layouts/PluginLayout.vue';
import { toast } from 'vue-sonner';

defineOptions({ layout: PluginLayout });

const form = useForm({
    email: '',
    password: ''
});

const emailEmpty:ComputedRef<boolean> = computed(() => form.email.trim() === '');
const passwordEmpty:ComputedRef<boolean> = computed(() => form.password.trim() === '');

function submit():void {

    form.clearErrors();

    if(emailEmpty.value){
        toast.error('El correo electrónico es obligatorio');
        return;
    }

    if(passwordEmpty.value){
        toast.error('La contraseña obligatoria');
        return;
    }

    form.post('/login', {
        onSuccess: () => {
            toast.success('Sesión iniciada correctamente');
        },
        onError: (errors) => {
            form.reset('password');

            if(errors.auth) toast.error(errors.auth);
        }
    });
}


</script>

<template>
    <main class="w-full min-h-screen gap-5 flex flex-col bg-background">
        <div class="flex justify-end w-full my-6 pr-6">
            <Link href="/register" class="text-base text-system-theme-500 hover:underline">¿No tienes una cuenta? Registrate aquí</Link>
        </div>

        <div class="flex flex-col gap-12 items-center">
            <p class="font-heading text-4xl max-w-lg font-semibold text-center text-text">Bienvenido a la plataforma EDIME Zona 02 </p>
            <div class="flex flex-col gap-6 bg-surface rounded-xl border border-border w-100 shadow-card-1">
                <h1 class="font-semibold text-text/80 text-3xl text-center mt-8 mb-4">Inicio de sesión</h1>

                <form class="flex flex-col gap-6 justify-center px-10 mb-10" @submit.prevent="submit">
                    <div>
                        <FloatLabel variant="on">
                            <InputText id="login-email" class="w-full" name="email" v-model="form.email"/>
                            <label for="login-email">Correo electrónico</label>
                        </FloatLabel>
                        <small class="text-red-600 font-medium block h-5">
                            {{ form.errors.email }}
                        </small>
                    </div>

                    <div>
                        <FloatLabel variant="on">
                            <Password name="password" id="login-password" class="w-full" toggle-mask :feedback="false" inputClass="w-full" v-model="form.password"/>
                            <label for="login-password">Contraseña</label>
                        </FloatLabel>
                        <small class="text-red-600 font-medium block h-5">
                            {{ form.errors.password }}
                        </small>
                    </div>


                    <div class="w-full flex flex-col items-center gap-5">
                        <Button rounded class="btn-login w-full" type="submit" :disabled="form.processing">
                            {{ form.processing ? "Iniciando sesión" : "Iniciar sesión" }}
                            <i v-if="!form.processing" class="ri-login-box-line text-lg"></i>
                            <i v-else class="ri-loader-3-line animate-spin"></i>
                        </Button>

                        <Link class="text-sm text-text hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    </main>

</template>

<style scoped>
.btn-login {
    transition:transform 0.2s ease-out;
}

.btn-login:hover {
    transform: scale(1.025);
}

</style>
