<template>
  <div v-if="indexPlugin<2 && !source" class="flex sticky pr-3">
      <MultiSelect v-model="selectedItems" :options="options" optionLabel="label" filter :placeholder="pluginName"
                   :maxSelectedLabels="0" :selectedItemsLabel="pluginName" class="w-[120px] " :panelClass="'w-auto max-w-[200px]'"> >
    <template #option="slotProps">
      <div class="flex items-center">
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
      </MultiSelect>
  </div>
  <div v-if="source" class="flex w-full pr-3">
    <div @click.self="$emit('closeModal')"> <!-- Permet la fermeture du modal -->
      <!-- MultiSelect dans une div qui bloque les clics sur le dropdown -->
      <div class="relative" @click="preventDropdownClick">
        <MultiSelect
          ref="multiSelectRef"
          v-model="selectedItems"
          :options="options"
          optionLabel="label"
          filter
          :placeholder="pluginName"
          :maxSelectedLabels="0"
          :selectedItemsLabel="pluginName"
          class="w-[280px] pointer-events-none"
        :panelClass="'w-[280px] min-w-[280px]'"
        @hide="keepDropdownOpen"
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
