<template>
  <div style="background-color: #212529" class="col-span-3 px-5 py-5 h-full max-h-full xs:max-h-[28%] overflow-auto">

    <!-- Both player  -->
    <AtomVideoHls v-if="activePlayer == false" ref="AtomVideoHlsRef" :video-src="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />
    <AtomVideoAmalia v-else :video-src="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <!-- Input to switch between player -->
    <div class=" flex items-center text-surface-0 gap-3 justify-center pt-3">
      <InputSwitch v-model="activePlayer" class="custom-inputswitch"    />
      <b>Amalia Player</b>
    </div>

    <AtomTopicList :topics="topics" :colors="colors" />
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

<script setup lang="js">
  import AtomVideoHls from '../atoms/AtomVideoHls'
  import AtomTopicList from '../atoms/AtomTopicList'
  import AtomVideoAmalia from '../atoms/AtomVideoAmalia.vue';
  import { useService } from '#imports';


  const amalia = useService().$amalia


  const activePlayer = ref(true)
  const props = defineProps({
    data: {
      type: Object,
      default: () => null
    },
    locals: {
      type: Object,
      default: () => null
    },
    colors: {
      type: Array,
      default: () => []
    },
    topics: {
      type: Array,
      default: ()=>[]
    },
    videoSrc: {
      type: String,
      default: ''
    }
  });
const { locals, colors, topics, videoSrc } = props;

  const AtomVideoHlsRef = $ref()

  const emits = defineEmits(['scroll-to-segment'])

  function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
    return videoTime
  }

  const updateVideoTimecode = (event) => {
    if (activePlayer.value) amalia.updateCurrentTc(unixToTimestamp(event.tcin) -1 )
    else AtomVideoHlsRef.videoRef.currentTime = unixToTimestamp(event.tcin) - 1 // Set video time to given timecode minus 1s to hear full segment
  }

  defineExpose({updateVideoTimecode})
</script>

<style>
/* Couleur de fond et bordure pour l'état activé */
.custom-inputswitch .peer:checked + span {
  background-color: #00BEFA !important;
  border-color: #00BEFA !important;
}

/* Couleur de fond pour l'état inactif */
.custom-inputswitch .peer + span {
  background-color: #EDEDED !important;
  border-color: #EDEDED !important;
}

/* Couleur de la manette coulissante */
.custom-inputswitch .peer:checked + span::before {
  background-color: #EDEDED !important;
}

</style>
