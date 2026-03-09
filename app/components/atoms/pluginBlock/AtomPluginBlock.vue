<template>
  <div data-testid="plugin-block-container" :class="{'grid grid-cols-3': source ,'flex  justify-start gap-2':!source }">
    <component
:is="selectComponent(plugin)?.component" v-for="(plugin, index) in config" :key="index" v-model:plugin-value="pluginValues[`plugin-${plugin.id}`]"
      v-bind="selectComponent(plugin)?.props" :plugin="plugin" :index="index" :source="source" :topic-index="topicIndex"
    />

  </div>
</template>

<script src="./atom-plugin-block-component" lang="ts">

</script>
