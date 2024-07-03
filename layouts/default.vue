<template>
  <div class="bg-gray-50 min-h-screen ">
    <Header />
    <main class="h-[calc(100vh-52px)]">
      <slot />
    </main>
    <MoleculeFooter />
  </div>
</template>



<script setup>
import MoleculeFooter from '~/components/molecules/MoleculeFooter.vue';

</script>
