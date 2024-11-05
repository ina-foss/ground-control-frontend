<template>
  <div>
    <MoleculeHeader />
    <main class="h-[calc(100%-88px)] fixed w-full  bg-[#F7F7F7]">
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
