<template>
  <div v-if="indexPlugin<3 && !source" class=" grid grid-cols-[100px_calc(100%-220px)] gap-3 gap-y-5 items-center " >
    <slot />
    <AutoComplete ref="autoCompleteRef" v-model="pluginValue" :suggestions="sortedOptionsByFilter"
                  option-label="label" multiple
                  class="w-full"
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
        <chip-wrapper class="flex items-center rounded-full bg-surface-100 max-w-full p-1 justify-around gap-2 px-4 ">
            <img
                v-if="!slotProps.value.image?.includes('icons')"
                :src="slotProps.value.image"
                alt="icon"
                class="h-10 object-contain"
            />
          <chip-content class="flex flex-col justify-center min-w-0 flex-1 ">
              <span class="font-medium text-gray-900 truncate">
                {{ slotProps.value.label }}
              </span>
              <span class="font-medium text-gray-500 truncate flex-none text-[10px] ">
                {{ slotProps.value.description }}
              </span>
          </chip-content>
          <span class="pi pi-times-circle cursor-pointer shrink-0 " @click="slotProps.removeCallback" />
        </chip-wrapper>
      </template>

    </AutoComplete>
    <div
      v-if="pluginValue?.[0]?.link && !iconClass"
      class="absolute right-7 -translate-y-1/2 flex items-center"
    >
      <a
        :href="pluginValue[0].link"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black"
        @click.stop
      >
        <img
          class="h-8 w-8 brightness-0"
          alt="wikidata icon"
          src="/icons/icons-svg/icons-svg/wikiData.svg"
        />
        <span>Wikidata</span>
      </a>
    </div>
    <div
      v-else-if="pluginValue[0]?.link && iconClass"
      class="absolute right-10 -translate-y-1/2 flex items-center"
    >
      <a
        :href="pluginValue[0].link"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-blue-50"
        @click.stop
      >
        <i :class="iconClass" style="font-size: 21px;"></i>
      </a>
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
            <chip-wrapper class="flex items-center rounded-full bg-surface-100 p-1 justify-around gap-2 px-4 ">
              <chip-content class="flex items-center gap-2  ">
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
<style scoped >

  /* Forcer l'affichage de la liste */
  .custom-multiselect .p-multiselect-panel {
    display: block !important;
    position: static !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

</style>

<style>

  .p-autocomplete-chip-item {
    max-width: 100% ;
  }
</style>
