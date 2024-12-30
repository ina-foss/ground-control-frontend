<template>
  <div v-if="showInput" class="w-[130px]">
    <InputText v-model="editedTitle" class="w-full" @focusout="showInput = false" />
  </div>
  <div v-else class="flex items-center justify-center h-full  ">
    <div :class="`h-8 text-lg w-fit px-3 flex items-center self-center  `">
      <b class="max-w-[100px] truncate ">{{ title }}</b>
    </div>
    <Button icon="pi pi-pencil" severity="contrast" text @click="showInput = true" />
  </div>
</template>

<script src="./atom-plugin-label.ts"> </script>
