<template>
  <Toast/>
  <Dialog
    :visible="dialogVisible"
    modal
    :style="{ width: '30%'}"
    class="bg-white"
    @after-hide="deleteDialog = false"
    @update:visible="emits('toggle-dialog')">
    <template #header>
      <span class="header-title">Raccourcis clavier</span>
    </template>
    <div>
      <div v-for="(shortcut,index) in shortcutList" key="index" class="flex justify-between items-center p-2">
        <div class="col-6">
          <span class="block mb-2">{{shortcut.value}}</span>
        </div>
        <div class="col-6 flex flex-col items-end">
          <Button class="rounded mb-2 " >{{shortcut.key}}</button>
        </div>
      </div>
    </div>

  </Dialog>

</template>

<script setup>
const {dialogVisible} = defineProps(['dialogVisible'])
const emits = defineEmits(['toggle-dialog'])
const deleteDialog = ref(false)

const shortcutList = [
  { key: "V", value: "Avance de 1 segments" },
  { key: "B", value: "Avance de 5 segments" },
  { key: "N", value: "Avance de 10 segments" },
  { key: "C", value: "Recul de 1 segments" },
  { key: "X", value: "Recul de 5 segments" },
  { key: "W", value: "Recul de 10 segments" },
  { key: "Espace", value: "Création d'une rupture avant" },
  { key: "Ctrl + Espace", value: "Création d'une rupture après" },
];
</script>
