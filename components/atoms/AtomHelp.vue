<template>
  <div>
    <button
      class="fixed bottom-5 right-5 bg-[#0086b1] text-white p-4 rounded-full pi pi-cog"
      @click="toggleChat"
    >
    </button>

    <div
      v-if="isOpen"
      class="fixed bottom-16 right-5 w-100 bg-white shadow-xl rounded-lg p-4 border border-gray-300"
    >
      <div class="flex justify-between items-center">
        <h2 class="header-title">Raccourcis clavier</h2>
        <button @click="toggleChat" class="header-title">✖</button>
      </div>

      <ul class="mt-2">
        <li v-for="(shortcut,index) in shortcutList" key="index" class="flex justify-between items-center p-2 border-b last:border-b-0">
          <div class="col-6">
            <span class="block mb-2">{{shortcut.value}}</span>
          </div>
          <div class="col-6 flex flex-col items-end">
            <Button class="rounded mb-2 " >{{shortcut.key}}</button>
          </div>
        </li>
      </ul>
    </div>
  </div>

</template>

<script setup>

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
  { key: "R", value: "Activer/Désactiver les numéros segments" },
  { key: "Espace", value: "Création d'une rupture avant" },
  { key: "Ctrl + Espace", value: "Création d'une rupture après" },
];

import { ref } from 'vue';

const isOpen = ref(false);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};
</script>
