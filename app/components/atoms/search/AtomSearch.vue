<template>
  <div v-if="!searchInterface" class="flex items-center -mr-3">
    <Button style="border-radius: 4px; outline: 1px #003A4C solid; outline-offset: -1px; color: #003A4C;" outlined icon="pi pi-search" label="Recherche" @click="invertInterface" />
  </div>
  <div v-else class="flex w-[320px] h-[40px] items-center bg-white rounded -mr-1">
    <div>
      <Button class="!bg-white !border-white" severity="secondary" icon="pi pi-chevron-circle-right" @click="invertInterface" />
    </div>
    <div v-if="labels.length > 0" class="w-[75%]">
      <Select v-model="selectedSearch" :options="labels" editable show-clear />
    </div>
    <div v-else class="w-[75%]">
      <div class="relative w-full">
        <InputText v-model="selectedSearch" type="text" class="pr-10 w-full" style="height:30px" />
        <i v-if="selectedSearch"
           class="pi pi-times absolute right-3 top-1/3 transform -translate-y-1/3 cursor-pointer text-gray-500"
           @click="clear()">
        </i>
      </div>
    </div>

    <Tag v-if="labels.length > 0 && selectedSpan.length > 0 && selectedSearch" class="!bg-white !border-white" severity="secondary">
      <span class="text-[#003A4C] font-bold">{{ searchIndex + 1 }}</span>/{{ selectedSpan.length }}
    </Tag>
    <Tag  v-if="!labels.length > 0 &&selectedSpan.length > 0 && selectedSearch" class="!bg-white !border-white" severity="secondary">
      <span class="text-[#003A4C] font-bold">{{ searchIndex + 1 }}</span>/{{ iterableSegment.length }}
    </Tag>
    <div class="grow flex flex-nowrap ml-1">
      <Button icon="pi pi-angle-down" class="!bg-white !border-white -mr-2" severity="secondary" @click="upIndex()" />
      <Button icon="pi pi-angle-up" class="!bg-white !border-white " severity="secondary" @click="downIndex()" />
    </div>
  </div>
</template>


<script lang="ts" src="./atom-search-component.ts"> </script>
