<template>
  <div>
    <MoleculeHeader />
    <main class="h-[calc(100vh)] fixed w-full pt-[60px] pb-5 ">
      <slot />
    </main>
    <MoleculeFooter />
  </div>
</template>



<script setup>
import MoleculeFooter from '~/components/molecules/MoleculeFooter.vue';
import MoleculeHeader from '~/components/molecules/MoleculeHeader.vue';

</script>
