<template>
  <div class="bottom-0 text-sm fixed bg-black text-white h-[70px] w-full pl-3" >
    <div class="centered-icon">
      <AtomLogo size="md" />
    </div>
  </div>

</template>


<script setup>
import { getApplicationConfiguration } from '~/services/dynamic-configuration-service';
import AtomLogo from "~/components/atoms/AtomLogo.vue";

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
