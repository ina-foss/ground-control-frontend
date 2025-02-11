<template>
  <div class="h-screen max-h-screen flex flex-col">
    <MoleculeHeader />
    <div class="flex flex-col flex-grow">
      <div class="h-fit"> <!-- Assuming the breadcrumbs have a height of 70px (16rem) -->
        <AtomBreadcrumbs />
      </div>
      <main class="flex-grow  w-full text-text bg-secondary-color">
        <slot />
      </main>
    </div>
  </div>
</template>



<script setup>
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
