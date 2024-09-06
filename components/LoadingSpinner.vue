<template>
    <div  class="flex w-full h-full flex justify-center items-center" style="height: 100vh;">
      <ProgressSpinner />
    </div>
  </template>

<script setup>

    const loading = defineProps(['loading'])
</script>
