<template>
  <div class=" text-sm flex justify-center bg-black text-white h-[70px] w-full  items-center" >
    <p class="pl-2 font-normal absolute left-0 text-sm text-left text-gray-400">v{{ config.version }} ({{data?.version}}) </p>
    <div class="centered-icon flex grow relative justify-center">
      <AtomLogo size="md" />
    </div>
  </div>

</template>


<script setup>
import AtomLogo from "~/components/atoms/AtomLogo.vue";
import { getApplicationConfiguration } from '~/services/dynamic-configuration-service';
import { ManagementService } from "~/api/generate"

const config = getApplicationConfiguration()
const {data} = useAsyncData('health',async()=>await ManagementService.getHealthManagementHealthGet())

</script>
<style>
.centered-icon{
  padding: 10px;
}
</style>
