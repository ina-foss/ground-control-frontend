<template>
  <div>
    <MoleculeHeader />
    <main class="h-[calc(100vh-140px)] fixed w-full  text-text  bg-neutral ">
      <div class="flex-grow">
        <AtomBreadcrumbs />
      </div>
      <slot />
    </main>
    <MoleculeFooter />
  </div>
</template>



<script setup>
import MoleculeFooter from '~/components/molecules/MoleculeFooter.vue';
import MoleculeHeader from '~/components/molecules/MoleculeHeader.vue';
import AtomBreadcrumbs from "~/components/atoms/AtomBreadcrumbs.vue";

</script>

<style lang="postcss">
  html {
    font-size: 14px;
  }

  body {
    @apply text-base text-text
  }
</style>
