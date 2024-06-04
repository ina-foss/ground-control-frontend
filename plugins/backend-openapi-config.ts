import {OpenAPI} from "~/api/generate";
import {
    getApplicationConfiguration,
} from "../services/dynamic-configuration-service";
import { inject } from "vue";
import { useService } from "../composables/useService";

export default defineNuxtPlugin({
    name: 'openapi-configuration',
    enforce: 'pre',
    hooks: {
        'app:created'() {
            const config = getApplicationConfiguration();
            // Configuring from env vars
            OpenAPI.BASE = config['apiBasePath'];
            const service = useService()
            OpenAPI.HEADERS = service.$application.getDefaultHeader() // Add the access token to the header of every OpenAPI calls
            inject('OpenAPI', OpenAPI);
        }
    }
})
