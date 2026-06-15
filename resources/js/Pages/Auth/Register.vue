<script setup lang="ts">
// Primer Vue
import { FloatLabel, InputText, Button } from 'primevue';

import { ref } from 'vue';

let loading = ref(false);

function load(){

    loading.value = true;
    console.log('cargando');

    setTimeout(() => { loading.value = false; console.log('finalizacion de carga'); }, 2000);
}

</script>

<template>

    <main class="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:p-8">

        <h1 class="font-heading font-bold text-4xl mb-10 italic">Registro</h1>
        <div class="shadow-card-1 w-10/12 max-w-6xl grid  grid-cols-1 lg:grid-cols-24 rounded-4xl overflow-hidden">
            <figure class="w-full h-48 lg:h-full overflow-hidden min-w-0 lg:col-span-14">
                <img class="h-full w-full block object-cover object-center" src="/images/hero-register.avif" alt="Manzana roja en 4 libros de pila">
                <figcaption class="sr-only">Foto de Element5 Digital en Unsplash</figcaption>
            </figure>

            <div class="flex flex-col shrink-0 lg:col-span-10 bg-surface">

                <form class="py-5 px-8 flex flex-col gap-5 flex-1 justify-evenly">

                    <fieldset class="min-w-0 flex flex-col gap-6">
                        <legend class="mb-3.5 font-heading font-semibold text-lg italic">Datos personales</legend>

                        <FloatLabel variant="on">
                            <InputText id="register-name" size="small" class="w-full"/>
                            <label for="register-name">Nombre</label>
                        </FloatLabel>

                        <div class="flex flex-col gap-6 md:flex-row md:gap-3">
                            <FloatLabel class="flex-1" variant="on">
                                <InputText id="register-first-lastName" size="small" class="w-full"/>
                                <label for="register-first-lastName">Apellido paterno</label>
                            </FloatLabel>

                            <FloatLabel class="flex-1" variant="on">
                                <InputText id="register-second-lastName" size="small" class="w-full"/>
                                <label for="register-second-lastName" >Apellido materno</label>
                            </FloatLabel>

                        </div>

                    </fieldset>

                    <fieldset class="min-w-0 flex flex-col gap-6">
                        <legend class="mb-3 font-heading font-semibold text-lg italic">Datos de contacto</legend>

                        <div class="flex flex-col gap-6 md:flex-row md:gap-3">
                            <FloatLabel variant="on" class="flex-1">
                                <InputText id="register-email" size="small" class="w-full"/>
                                <label for="register-email">Correo electrónico</label>
                            </FloatLabel>

                            <FloatLabel variant="on" class="flex-1">
                                <InputText id="register-password" size="small" class="w-full"/>
                                <label for="register-password">Contraseña</label>
                            </FloatLabel>
                        </div>

                        <div class="w-full flex justify-center">
                            <FloatLabel variant="on" class="flex-1 max-w-full md:max-w-1/2">
                                <InputText id="register-phone" size="small" class="w-full"/>
                                <label for="register-phone" class="text-sm">Teléfono (Opcional)</label>
                            </FloatLabel>
                        </div>
                    </fieldset>

                    <Button class="flex" v-on:click="load" :disabled="loading">
                        <span class="block">Registrarme</span>
                        <span class="w-5 h-5" v-if="loading">
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
