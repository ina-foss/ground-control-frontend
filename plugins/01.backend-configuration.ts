import { OpenAPI } from "~/api/generate";
import {
  initApplicationConfiguration,
} from "../services/dynamic-configuration-service";
import { inject } from "vue";
import { useService } from "../composables/useService";
import { createPinia } from "pinia";

export default defineNuxtPlugin({
  name: 'openapi-configuration',
  enforce: 'pre',
  async setup(nuxtApp) { initApplicationConfiguration() }

})
