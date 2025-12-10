<template>
  <div v-if="indexPlugin<3 && !source" class=" grid grid-cols-[100px_auto] gap-3 gap-y-5 items-center " >
    <slot />
    <div class="w-[calc(100%-110px)] flex">
    <AutoComplete ref="autoCompleteRef" v-model="pluginValue" :suggestions="sortedOptionsByFilter"
                  class="grow"
                  option-label="label" multiple
                  :delay="300"
                  :disabled="!isAnnotationEditable"
                  :dropdown="pluginValue?.length < max_length" dropdown-mode="current"
                  input-id="autocomplete-input"
                  :scroll-height="maximumScrollHeight + 'px'"
                  :placeholder="pluginValue?.length < max_length ? 'Taper pour rechercher' : ''"
                  :loading="showSkeleton"
                  @complete="handleFilter"
                  @dropdown-click="onDropdownOpen">
      <template #option="slotProps">
        <div class="flex items-start space-x-2 w-[450px] overflow-auto ">
          <img
              v-if="slotProps.option.image"
              :src="slotProps.option.image"
              alt="icon"
              class="w-14 h-14 object-contain"
        />
        <div class="flex flex-col pt-2">
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
            <chip-text class="flex flex-col ">
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
            option-label="label"
            :placeholder="pluginName"
            :max-selected-labels="0"
            :selected-items-label="pluginName"
            class="w-[280px] always-open"
            :panel-class="' w-[280px] min-w-[280px] '"
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
