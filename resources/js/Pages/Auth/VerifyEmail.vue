<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Button } from 'primevue';

import ToastLayout from '@/Layouts/ToastLayout.vue';
import { toast } from 'vue-sonner';

defineOptions({ layout: ToastLayout });

interface VerifyEmailProps {
    email:string;
    message:string;
}

const props = defineProps<VerifyEmailProps>();

const form = useForm({});
const totalSeconds = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const disabledButton = computed(() => {
    return (totalSeconds.value > 0) || form.processing;
});

const formattedTime = computed(() => {
    const minutes = Math.floor(totalSeconds.value / 60);
    const seconds = totalSeconds.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Función que arranca el contador
const startCooldown = () => {
    totalSeconds.value = 60; // 60 segundos de espera entre reenvíos

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
        if (totalSeconds.value > 0) {
            totalSeconds.value--;
        } else {
            clearInterval(timer!);
        }
    }, 1000);
};

// Función para solicitar el reenvío
const resendEmail = () => {
    form.post('/email/verification-notification', {
        onSuccess: () => {

            if(props.message) toast.success(props.message);

            startCooldown();
        }
    });
};

const logout = () => {
    form.post('/logout');
};

onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<template>
    <section class="w-full min-h-screen flex flex-col bg-system-theme-50">
        <div class="w-full flex justify-end px-6 py-3 shrink-0">
            <Button variant="link" class="hover:underline text-system-theme-800!" @click="logout" :loading="form.processing">
                Cerrar sesión
            </Button>
        </div>

        <div class="flex-1 flex items-center justify-center">

            <div class="card max-w-4xl p-8 bg-surface shadow-card-1 text-center">

                <h1 class="text-2xl font-bold mb-6 text-system-theme-950">¡¡Gracias por tu registro!!</h1>

                <div class="flex flex-col md:flex-row items-center gap-8 text-left">

                    <figure class="h-30 w-30 md:h-100 md:w-100 shrink-0">
                        <img class="h-full w-full block object-cover object-center" src="/images/edime_logo_bg_white.avif" alt="Logo de la plataforma EDIME">
                    </figure>

                    <div class="flex flex-col gap-4">
                        <p class="text-system-theme-600 text-center">
                            Hemos enviado un enlace de confirmación a <span class="font-bold text-system-theme-800">{{ email }}</span>.
                            Por favor, haz clic en él para activar tu cuenta.
                        </p>

                        <div class="bg-system-theme-50 text-system-theme-800 p-3 rounded-md text-sm flex gap-3 items-center">
                            <i class="ri-spam-line text-2xl"></i>
                            <p>¿No lo encuentras? Revisa tu carpeta de correo no deseado (spam).</p>
                        </div>

                        <div class="mt-4 border-t border-border pt-4 text-center">
                            <p class="text-sm text-system-theme-500 mb-3">¿El correo no llegó o el enlace expiró?</p>
                            <div class="flex items-center gap-3 justify-center flex-col">
                                <Button @click="resendEmail" :disabled="disabledButton" :loading="form.processing">
                                    Reenviar enlace
                                </Button>

                                <span v-if="totalSeconds > 0" class="text-sm font-medium text-orange-600">
                                    Espera {{ formattedTime }} para volver a enviarlo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>

</style>
