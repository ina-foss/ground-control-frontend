<template>
  <div v-if="showInput" class="w-[130px]">
    <AutoComplete v-model="value" :suggestions="items" multiple @before-hide="showInput=false"  @complete="search" class="w-[100px]" >
      <template #option="slotProps">
          <div class="flex items-center">
              <div>{{ slotProps.option.label }}</div>
          </div>
      </template>
    </AutoComplete>
  </div>
  <div v-else>
    <Button text severity="contrast" icon="pi pi-bookmark" @click="showInput = true" />
  </div>
  <Chip v-for="(chip,index) in chipList" :label="chip.label" removable v-on:remove="handleRemove(index)"  />
</template>

<script lang="ts" src="./atom-plugin-autocomplete-component">

</script>
