<template>
<div class="w-full p-2 border m-2 ">
    {{local?.data.text[0]}}
  </div>
</template>

<script setup>

const { local } = defineProps({
  local: {
    type: Object,
    default : () => {}
  }
})



</script>
