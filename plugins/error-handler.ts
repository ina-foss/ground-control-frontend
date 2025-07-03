import { defineNuxtPlugin } from "#app";
import { useToast } from "primevue/usetoast";

export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast();

  // Intercept API errors (like OpenAPI-generated ApiError)
  nuxtApp.provide("handleApiError", (error: any) => {
    console.error("🚨 API Error Caught:", error);

    let errorMessage = "Une erreur s'est produite.";
    if (error?.body?.raw_message) {
      errorMessage = error.body.raw_message; //back-end errors
    } else if (error?.message) {
      errorMessage = error.message; //OpenAPI-generated ApiError
    }

    toast.add({
      severity: "error",
      summary: "Erreur API",
      detail: errorMessage,
      life: 7000,
    });
  });
});
