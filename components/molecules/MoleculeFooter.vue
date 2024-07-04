<template>
  <div class="bottom-0 text-sm fixed bg-primary-600 text-white h-[20px] w-full pl-3" >
    <p>© 2024 Institut national de l'audiovisuel V{{ runtimeConfig.public.version }} </p>
  </div>

</template>


<script setup>
import AtomLogo from '../atoms/AtomLogo.vue';

const runtimeConfig = useRuntimeConfig()
</script>
