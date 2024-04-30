<template>
    <div v-if="$props.loading" class="p-d-flex p-jc-center p-ai-center" style="height: 100vh;">
      <ProgressSpinner />
    </div>
  </template>

<script setup>

    const loading = defineProps(['loading'])
</script>