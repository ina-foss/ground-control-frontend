<template>
  <div class="grid grid-cols-3 ">
    <component v-for="(plugin, index) in config" :is="selectComponent(plugin)?.component"
      v-bind="selectComponent(plugin)?.props" :plugin="plugin" :index="index" :source="source"/>

  </div>
</template>

<script src="./atom-plugin-block-component.ts" lang="ts">

</script>
