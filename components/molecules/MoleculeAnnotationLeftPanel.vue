<template>
  <div class="col-span-3 bg-surface-700 px-5 py-5 h-full max-h-full xs:max-h-[28%] overflow-auto">
    <AtomVideoHls ref="AtomVideoHlsRef" :data="data" :videoSrc="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />
    <AtomVideoAmalia :videoSrc="videoSrc" />
    <AtomTopicList :colors="colors" />
    <h2 class="text-white text-3xl md:block xs:hidden p-3 font-semibold">Segmentation</h2>
      <p class="text-white p-3 md:block xs:hidden ">
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
  import AtomVideoAmalia from '../atoms/AtomVideoAmalia.vue';

const props = defineProps({
  data: null,
  locals: null,
  colors: {
    type: Array,
    default: () => []
  },
  videoSrc: String
});

const { data, locals, colors, videoSrc } = props;

  const AtomVideoHlsRef = $ref()

  const emits = defineEmits(['scroll-to-segment'])

  function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
    return videoTime
  }

  const updateVideoTimecode = (event) => {
    AtomVideoHlsRef.videoRef.currentTime = unixToTimestamp(event.tcin)
  }


  defineExpose({updateVideoTimecode})
</script>
