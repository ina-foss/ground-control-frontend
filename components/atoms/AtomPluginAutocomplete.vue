<template>
  <div v-if="indexPlugin<3 && !source" class="flex grow min-w-fit ">
      <MultiSelect :disabled="!isAnnotationEditable" v-model="selectedItems" :options="options" optionLabel="label" filter :placeholder="pluginName"
                   :maxSelectedLabels="0" :selectedItemsLabel="pluginName" class="w-fit " :panelClass="'w-auto max-w-[200px]'"> >
    <template #option="slotProps">
      <div class="flex items-center">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
      </MultiSelect>
  </div>
  <div v-if="source" class="  h-[300px] ">
    <div class="w-full flex justify-center" @click.self="$emit('closeModal')"> <!-- Permet la fermeture du modal -->
      <!-- MultiSelect dans une div qui bloque les clics sur le dropdown -->
      <div class="relative" @click="preventDropdownClick">
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
          class="w-[280px] pointer-events-none"
        :panelClass="'w-[280px] min-w-[280px]'"
        @before-hide="keepDropdownOpen"
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
