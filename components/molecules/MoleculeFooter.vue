<template>
  <div class="bottom-0 text-sm fixed bg-primary-600 text-white h-[20px] w-full pl-3" >
    <p>© 2024 Institut national de l'audiovisuel V{{ config.version }} </p>
  </div>

</template>


<script setup>
import { getApplicationConfiguration } from '~/services/dynamic-configuration-service';

const config = getApplicationConfiguration()
</script>
