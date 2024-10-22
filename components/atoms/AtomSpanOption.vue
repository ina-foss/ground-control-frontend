<template>
  <div class="flex justify-center border gap-3 rounded flex-col w-[250px] px-6 py-2">
    <b>Affichage</b>
    <div class="flex justify-between gap-2">
      <span>Span</span>
      <InputSwitch v-model="span" />
    </div>
    <div class="flex justify-between gap-2">
      <span>TC</span>
      <InputSwitch v-model="timecode"/>
    </div>
    <div class="flex justify-between gap-2">
      <span>Bloc</span>
      <InputSwitch v-model="bloc"/>
    </div>
  </div>
</template>


<script setup lang="ts">

const span = defineModel<boolean>('span')
const timecode = defineModel<boolean>('timecode')
const bloc = defineModel<boolean>('bloc')


</script>
