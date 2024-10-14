<template>
  <div class="bottom-0 text-sm flex fixed bg-black text-white h-[70px] w-full  items-center" >
    <p style="color:#BDBDBD;" class="font-normal text-sm text-left">V{{ config.version }} </p>
    <div class="centered-icon">
      <AtomLogo size="md" />
    </div>
  </div>

</template>


<script setup>
import AtomLogo from "~/components/atoms/AtomLogo.vue";
import { getApplicationConfiguration } from '~/services/dynamic-configuration-service';
const config = getApplicationConfiguration()

</script>
<style>
.centered-icon{
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  width: 120px;
}
</style>
