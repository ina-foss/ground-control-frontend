import {
  initApplicationConfiguration,
} from "../services/dynamic-configuration-service";

export default defineNuxtPlugin({
  name: 'openapi-configuration',
  enforce: 'pre',
  async setup() { await initApplicationConfiguration() }

})
