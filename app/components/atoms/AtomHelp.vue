<template>
  <div>
    <div class="fixed bottom-5 right-5 !bg-primary !border-primary text-white rounded-full">
      <Button @click="visibleRight = true" >
        <img style="height:14px;width:14px;filter: invert(1);" :src="helpIcon" alt="help icon" >
      </Button>
    </div>
    <Drawer
v-model:visible="visibleRight" header="Raccourcis clavier" position="right"
             class="shadow-xl rounded-lg border border-gray-300 "  :style="{ height: '75vh', width:'fit-content', marginRight: '30px' }">

        <ul class="-m-4 my-2">
          <li v-for="(shortcut,index) in shortcutList" :key="index" class="flex justify-between items-center p-2 border-b last:border-b-0">
            <div class="col-6">
              <span class="block mb-2">{{shortcut.value}}</span>
            </div>
            <div class="col-6 flex flex-col items-end">
              <Button outlined class="ml-3 font-bold" >{{shortcut.key}}</button>
            </div>
          </li>
        </ul>
    </Drawer>

  </div>

</template>

<script setup>

import { ref } from 'vue';

const helpIcon = '/icons/icons-svg/icons-svg/help-icon.svg';
const visibleRight = ref(false);
const shortcutList = [
  { key: "V", value: "Avance de 1 segments" },
  { key: "B", value: "Avance de 5 segments" },
  { key: "N", value: "Avance de 10 segments" },
  { key: "C", value: "Recul de 1 segments" },
  { key: "X", value: "Recul de 5 segments" },
  { key: "W", value: "Recul de 10 segments" },
  { key: "A", value: "Activer/Désactiver les TC blocs" },
  { key: "Z", value: "Activer/Désactiver les TC segments" },
  { key: "E", value: "Activer/Désactiver la synchro player" },
  { key: "R", value: "Activer/Désactiver les n° segments" },
  { key: "Espace", value: "Création d'une rupture avant" },
  { key: "Ctrl + Espace", value: "Création d'une rupture après" },
];
</script>
