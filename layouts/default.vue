<template>
  <div>
    <MoleculeHeader />
    <main class="h-[calc(100vh)] fixed w-full pt-[60px] pb-5" style="background-color: #F7F7F7">
      <div class="flex-grow pt-2">
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
