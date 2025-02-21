<template>
  <div v-if="!searchInterface" class="flex items-center">
    <Button severity="contrast" icon="pi pi-search" label="Recherche" @click="invertInterface" />
  </div>
  <div v-else class="flex w-[300px] items-center bg-surface-950 rounded ">
    <div class="grow">
     <Button severity="contrast" icon="pi pi-search" @click="invertInterface"  />
    </div>
    <div v-if="labels.length>0" class="w-[75%]">
    <Select v-model="selectedSearch" :options="labels" editable show-clear />
    </div>
    <div v-else class="w-[75%]">
      <div class="relative w-full">
        <InputText v-model="selectedSearch" type="text" class="pr-10 w-full" />
        <i v-if="selectedSearch"
           class="pi pi-times absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
           @click="selectedSearch = ''">
        </i>
      </div>
    </div>
    <Tag v-if="selectedSpan.length > 0" severity="contrast" >
      {{ searchIndex+1 }}/{{ selectedSpan.length }}
    </Tag>
    <div class="grow flex flex-nowrap">
      <Button icon="pi pi-arrow-left" size="small"  severity="contrast" @click="downIndex()" />
      <Button icon="pi pi-arrow-right" size="small" severity="contrast" @click="upIndex()" />
    </div>
  </div>

</template>

<script lang="ts" src="./atom-search-component.ts"> </script>
