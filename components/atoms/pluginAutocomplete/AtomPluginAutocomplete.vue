<template>
  <div v-if="indexPlugin<3 && !source" class="w-full">
    <AutoComplete ref="autoCompleteRef" :disabled="!isAnnotationEditable" v-model="pluginValue" :suggestions="sortedOptionsByFilter"
                  :emptyFilterMessage="' '" optionLabel="label" multiple
                  dropdown dropdown-mode="current"
                  input-id="autocomplete-input"
                  :max-selected-labels="0"
                  scrollHeight="500px"
                 @complete="handleFilter" :placeholder="'Taper pour rechercher'" :loading="showSkeleton"
                 :selectedItemsLabel="pluginName"   @dropdown-click="onDropdownOpen">
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

      <template #chip="slotProps">
        <chip-wrapper class="flex items-center rounded-full bg-surface-100 p-1 justify-around gap-2 px-4">
          <chip-content class="flex items-center gap-2">
            <img
                v-if="!slotProps.value.image?.includes('icons')"
                :src="slotProps.value.image"
                alt="icon"
                class="h-10 object-contain"
            />
            <chip-text class="flex flex-col max-w-[150px]">
              <span class="font-medium text-gray-900 truncate">
                {{ slotProps.value.label }}
              </span>
              <span class="font-medium text-gray-500 truncate text-[10px] ">
                {{ slotProps.value.description }}
              </span>
            </chip-text>
          </chip-content>
          <span class="pi pi-times-circle cursor-pointer" @click="slotProps.removeCallback" />
        </chip-wrapper>
      </template>

    </AutoComplete>
  </div>
  <div v-if="source" class="  h-[300px] ">
    <div class="w-full flex justify-center" @click.self="$emit('closeModal')">
      <div class="relative custom-multiselect">
        <AutoComplete
            ref="autoCompleteRef"
            v-model="pluginValue"
            multiple
            dropdown
            dropdown-mode="current"
            :suggestions="options"
            optionLabel="label"
            :placeholder="pluginName"
            :maxSelectedLabels="0"
            :selectedItemsLabel="pluginName"
            class="w-[280px] always-open"
            :panelClass="' w-[280px] min-w-[280px] '"
            @complete="handleFilter"
        >
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

          <template #chip="slotProps">
            <chip-wrapper class="flex items-center rounded-full bg-surface-100 p-1 justify-around gap-2 px-4">
              <chip-content class="flex items-center gap-2">
                <img
                    v-if="!slotProps.value.image?.includes('icons')"
                    :src="slotProps.value.image"
                    alt="icon"
                    class="h-10 object-contain"
                />
                <chip-text class="flex flex-col max-w-[150px]">
                  <span class="font-medium text-gray-900 truncate">
                    {{ slotProps.value.label }}
                  </span>
                  <span class="font-medium text-gray-500 truncate text-[10px] ">
                    {{ slotProps.value.description }}
                  </span>
                </chip-text>
              </chip-content>
              <span class="pi pi-times-circle cursor-pointer" @click="slotProps.removeCallback" />
            </chip-wrapper>
          </template>

        </AutoComplete>
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
