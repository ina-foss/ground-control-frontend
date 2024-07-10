<template>
  <div class="col-span-3 bg-surface-700 px-5 py-5 h-full overflow-auto">
    <AtomVideoHls ref="AtomVideoHlsRef" :data="data" :locals="locals" @timecode-update="$emits('scroll-to-segment')" />
    <AtomTopicList :colors="colors" />
    <h2 class="text-white text-3xl p-3 font-semibold">Segmentation</h2>
      <p class="text-white p-3 ">
        Dans le cadre d'une segmentation par thématique, une transcription est découpée en segment.<br>
        Chaque segment correspond à une thématique différente de la précédente.<br>
        Chaque changement de segment correspond à un changement d'interlocuteur ou de sujet.<br><span
          class="underline">Exemple</span> :
        <br>si on souhaite retranscrire le contenu d'une émission qui dure 1h, grâce à la segmentation, nous pouvons
        avoir un "résumé" du contenu de l'émission grâce aux différents segments. Ces derniers retracent les divers
        sujets
        ayant été traités, différencie les interlocuteurs.
      </p>
  </div>
</template>

<script setup>
import AtomVideoHls from '../atoms/AtomVideoHls'
import AtomTopicList from '../atoms/AtomTopicList'
import ScrollPanel from 'primevue/scrollpanel';

const { data, locals, colors } = defineProps(['data', 'locals', 'colors'])

const emits = defineEmits(['scroll-to-segment'])

</script>
