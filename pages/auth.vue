<template>
  <div class="mb-6 text-blue-700 text-2xl">
    Loading authentication...
  </div>
</template>

<script setup>
import { useService } from "@/composables/useService";
import { onMounted } from "vue";

const services = useService();

const { $handleApiError } = useNuxtApp()

const authenticateOidc = async () => {
  try {
    const user = await services.$auth.signInCallback();
    navigateTo(user.url_state);
  } catch (error) {
    console.error(error);
    $handleApiError(error)
  }
};

// Use onMounted to handle async logic
onMounted(async () => {
  await authenticateOidc();
});
</script>
