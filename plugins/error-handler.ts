import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast();
  // vue:error hook is based on onErrorCaptured lifecycle hook.
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error("Global Vue Error:", error, info);
    toast.add({
      severity: "error",
      summary: "Erreur détectée",
      detail: error.message || "Une erreur inconnue est survenue",
      life: 5000,
    });
  });

  // server and client errors
  nuxtApp.hook('app:error', (error) => {
    console.error("Nuxt Global Error:", error);
    toast.add({
      severity: "error",
      summary: "Erreur critique",
      detail: error.message || "Une erreur inattendue s'est produite",
      life: 5000,
    });
  });
  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.component('Toast', Toast);
});
