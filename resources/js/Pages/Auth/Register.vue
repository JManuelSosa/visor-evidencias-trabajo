<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';

// Prime Vue
import { FloatLabel, InputText, Button, Password } from 'primevue';

const form = useForm({
    name: '',
    paternal_last_name: '',
    maternal_last_name: '',
    phone: '',
    email: '',
    password: ''
});

function signIn(){
    form.post('/register', {
        onSuccess: () => {
            console.log('ok');
        },
        onError: (errors) => {
            console.log(errors);
        }
    });
}

</script>

<template>

    <main class="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:p-8 bg-system-theme-50">


        <div class="shadow-card-1 w-10/12 max-w-6xl grid grid-cols-1 lg:grid-cols-24 rounded-4xl overflow-hidden">
            <figure class="w-full h-48 lg:h-full overflow-hidden min-w-0 lg:col-span-14">
                <img class="h-full w-full block object-cover object-center" src="/images/hero-register.avif" alt="Manzana roja en 4 libros de pila">
                <figcaption class="sr-only">Foto de Element5 Digital en Unsplash</figcaption>
            </figure>

            <div class="flex flex-col shrink-0 lg:col-span-10 bg-surface">
                <h1 class="font-heading font-bold text-3xl italic text-center mt-6">Registro</h1>
                <form class="py-5 px-8 flex flex-col gap-3 flex-1 justify-evenly" @submit.prevent="signIn">
                    <fieldset class="min-w-0 flex flex-col gap-2.5">
                        <legend class="mb-3.5 font-heading font-semibold text-lg italic">Datos personales</legend>

                        <div>
                            <FloatLabel variant="on">
                                <InputText id="register-name" size="small" class="w-full" name="name" v-model="form.name"/>
                                <label for="register-name">Nombre</label>
                            </FloatLabel>
                            <small class="text-red-600 font-medium text-xs text-center block h-5">
                                {{ form.errors.name }}
                            </small>
                        </div>


                        <div class="flex flex-col gap-6 md:flex-row md:gap-3">
                            <div class="flex-1">
                                <FloatLabel variant="on">
                                    <InputText id="register-first-lastName" size="small" class="w-full" name="paternal_last_name" v-model="form.paternal_last_name"/>
                                    <label for="register-first-lastName">Apellido paterno</label>
                                </FloatLabel>
                                <small class="text-red-600 font-medium text-xs text-center block h-5">
                                    {{ form.errors.paternal_last_name }}
                                </small>
                            </div>

                            <div class="flex-1">
                                <FloatLabel variant="on">
                                    <InputText id="register-second-lastName" size="small" class="w-full" name="maternal_last_name" v-model="form.maternal_last_name"/>
                                    <label for="register-second-lastName" >Apellido materno</label>
                                </FloatLabel>
                                <small class="text-red-600 font-medium text-xs text-center block h-5">
                                    {{ form.errors.maternal_last_name }}
                                </small>
                            </div>


                        </div>

                    </fieldset>

                    <fieldset class="min-w-0 flex flex-col gap-4.5">
                        <legend class="mb-3 font-heading font-semibold text-lg italic">Datos de contacto</legend>

                        <div class="flex flex-col gap-6 md:flex-row md:gap-3">
                            <div class="flex-1">
                                <FloatLabel variant="on">
                                    <InputText name="email" id="register-email" size="small" class="w-full" v-keyfilter.email v-model="form.email"/>
                                    <label for="register-email">Correo electrónico</label>
                                </FloatLabel>
                                <small class="text-red-600 font-medium text-xs text-center block h-5">
                                    {{ form.errors.email }}
                                </small>
                            </div>
                            <div class="flex-1">
                                <FloatLabel variant="on" class="w-full">
                                    <Password class="w-full" name="password" toggle-mask id="register-password" size="small" input-class="w-full" :feedback=false v-model="form.password"/>
                                    <label for="register-password">Contraseña</label>
                                </FloatLabel>
                                <small class="text-red-600 font-medium text-xs text-center block h-5">
                                    {{ form.errors.password }}
                                </small>
                            </div>

                        </div>

                        <div class="w-full flex justify-center">
                            <div class="w-full md:w-1/2 flex flex-col">
                                <FloatLabel variant="on" class="w-full">
                                    <InputText id="register-phone" size="small" class="w-full" name="phone" v-keyfilter.int maxlength="10" v-model="form.phone"/>
                                    <label for="register-phone" class="text-sm">Teléfono (Opcional)</label>
                                </FloatLabel>
                                <small class="text-red-600 font-medium text-xs text-center block h-5">
                                    {{ form.errors.phone }}
                                </small>
                            </div>
                        </div>
                    </fieldset>

                    <Button class="flex" type="submit" :disabled="form.processing">
                        <span class="block">Registrarme</span>
                        <span class="w-5 h-5" v-if="form.processing">
                            <i class="ri-loader-5-fill animate-spin inline-flex items-center justify-center w-2.5 h-2.5 origin-bottom-left absolute"></i>
                        </span>
                    </Button>

                </form>
            </div>
        </div>

    </main>

</template>

<style>

</style>
