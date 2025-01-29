import DOMPurify from "dompurify";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("safe-html", {
    beforeMount(el, binding) {
      el.innerHTML = DOMPurify.sanitize(binding.value);
    },
    updated(el, binding) {
      el.innerHTML = DOMPurify.sanitize(binding.value);
    },
  });
});
