import Tooltip from 'primevue/tooltip';
import 'floating-vue/dist/style.css'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.directive('tooltip', Tooltip);
});