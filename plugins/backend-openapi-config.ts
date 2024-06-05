import {OpenAPI} from "~/api/generate";
import {
    getApplicationConfiguration,
    initApplicationConfiguration,
} from "~/services/dynamic-configuration-service";

export default defineNuxtPlugin({
    name: 'openapi-configuration',
    enforce: 'pre',
    hooks: {
        async 'app:created'() {
            await initApplicationConfiguration();
            const config = getApplicationConfiguration();
            // Configuring from env vars
            OpenAPI.BASE = config['apiBasePath'];
            inject('OpenAPI', OpenAPI);
        }
    }
})