<template>
  <div class=" flex flex-col justify-center items-center pb-6 gap-4 ">
    <div class="w-full h-[1px] bg-surface-300 mb-3"></div>
    <AtomLogo size="md"  />
    <div class="flex gap-5 justify-center text-sm" >
      <p>Ground Control</p>
      <p>{{ runtimeConfig.public.version }} </p>
    </div>
  </div>

</template>


<script setup>
import AtomLogo from '../atoms/AtomLogo.vue';

const runtimeConfig = useRuntimeConfig()
</script>
