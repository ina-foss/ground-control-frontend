<template>
  <div v-if="indexPlugin<3 && !source" class="flex grow min-w-fit ">
    <MultiSelect  ref="multiSelectRef" :disabled="!isAnnotationEditable" v-model="pluginValue" :options="sortedOptionsByFilter"
                 emptyMessage="Rechercher un label" :emptyFilterMessage="' '" optionLabel="label" filter
                  class="w-[215px]"
                  :max-selected-labels="0"
      scrollHeight="500px"
                 @filter="handleFilter" :placeholder="pluginName" :loading="showSkeleton"
                 :selectedItemsLabel="pluginName" fluid  @show="onDropdownOpen">
      <template #option="slotProps">
        <div class="flex items-center space-x-2 w-[250px] ">
          <img
              v-if="slotProps.option.image"
              :src="slotProps.option.image"
              alt="icon"
              class="w-14 h-14 object-contain"
          />

          <div class="flex flex-col">
            <span class="font-medium text-gray-900">
              {{ slotProps.option.label }}
            </span>
            <span v-if="slotProps.option.description" class="text-xs text-gray-400">
              {{ slotProps.option.description }}
            </span>
          </div>
        </div>
      </template>
      <template #value="slotProps" >
        <div v-if="pluginValue?.length && showValue" class="h-full">
          {{pluginValue.map(value => value.label).join(', ')  }}
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
