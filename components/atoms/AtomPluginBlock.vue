<template>
  <div class="flex flex-col">
    <component v-for="(plugin, index) in config" :is="selectComponent(plugin)?.component"
      v-bind="selectComponent(plugin)?.props" :plugin="plugin" :index="index" />

  </div>
</template>

<script src="./atom-plugin-block-component.ts" lang="ts">

</script>
