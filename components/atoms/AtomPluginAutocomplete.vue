<template>
  <div v-if="indexPlugin<3 && !source" class="flex grow min-w-fit ">
    <MultiSelect :disabled="!isAnnotationEditable" overlay-style="max-width: 350px  "  v-model="selectedItems" :options="sortedOptionsByFilter" optionLabel="label" filter @filter="handleFilter" :placeholder="pluginName"
                   :maxSelectedLabels="0" :selectedItemsLabel="pluginName" class="w-fit " :panelClass="'w-auto max-w-[200px]'"> >
    <template #option="slotProps">
      <div class="flex items-center ">
          <div v-tooltip.top="{showDelay: 1000 ,value:slotProps.option.label}">{{ slotProps.option.label }}</div>
      </div>
    </template>
      </MultiSelect>
  </div>
  <div v-if="source" class="  h-[300px] ">
    <div class="w-full flex justify-center" @click.self="$emit('closeModal')">
      <div class="relative custom-multiselect">
        <MultiSelect
          ref="multiSelectRef"
          v-model="selectedItems"
          :options="options"
          optionLabel="label"
          display="chip"
          filter
          filterMatchMode="startsWith"
          :placeholder="pluginName"
          :maxSelectedLabels="0"
          :selectedItemsLabel="pluginName"
          class="w-[280px] pointer-events-none always-open"
          :panelClass="' w-[280px] min-w-[280px] '"
          aria-labelledby="custom-multiselect-label"
          @hide=" keepDropdownOpen();"
        >
        <template #option="slotProps">
          <div class="flex items-center">
            <div>{{ slotProps.option.label }}</div>
          </div>
        </template>
        </MultiSelect>
      </div>
    </div>

  </div>
</template>

<script lang="ts" src="./atom-plugin-autocomplete-component">

</script>
<style scoped>
/* Forcer l'affichage de la liste */
.custom-multiselect .p-multiselect-panel {
  display: block !important;
  position: static !important;
  visibility: visible !important;
  opacity: 1 !important;
}

</style>
