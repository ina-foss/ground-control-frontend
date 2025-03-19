<template>
  <div class="mb-6 text-blue-700 text-2xl">
    Loading authentication...
  </div>
</template>

<script setup>
import { useService } from "@/composables/useService";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const services = useService();
const router = useRouter();
const { $handleApiError } = useNuxtApp()

const authenticateOidc = async () => {
  try {
    await services.$auth.signInCallback();
    router.push("/");
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
