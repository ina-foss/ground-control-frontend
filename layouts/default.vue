<template>
  <div class="h-screen max-h-screen flex flex-col">
    <Toast class="!top-[60px]"/>
    <MoleculeHeader />
    <div class="flex flex-col flex-1 overflow-hidden ">
      <div class="h-fit"> <!-- Assuming the breadcrumbs have a height of 70px (16rem) -->
        <AtomBreadcrumbs />
      </div>
      <main class="flex-grow overflow-hidden w-full text-text bg-secondary">
        <slot />
      </main>
    </div>
  </div>
</template>



<script setup>
import MoleculeHeader from '~/components/molecules/MoleculeHeader.vue';
import AtomBreadcrumbs from "~/components/atoms/AtomBreadcrumbs.vue";

</script>

<style >
  @reference "../assets/css/app.css";

  html {
    font-size: 14px;
  }

  body {
    @apply text-base text-text
  }
</style>
