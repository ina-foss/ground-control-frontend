<template>
  <div v-if="indexPlugin<3" class="flex sticky pr-3">

      <MultiSelect v-model="selectedItems" :options="options" optionLabel="label" filter :placeholder="pluginName"
                   :maxSelectedLabels="0" :selectedItemsLabel="pluginName" class="w-[120px] " :panelClass="'w-auto min-w-[250px]'"> >
    <template #option="slotProps">
      <div class="flex items-center">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
      </MultiSelect>
  </div>

</template>

<script lang="ts" src="./atom-plugin-autocomplete-component">

</script>
