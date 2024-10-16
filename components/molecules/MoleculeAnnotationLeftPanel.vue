<template>
  <div style="background-color: #212529" class="col-span-3 px-5 py-5 h-full max-h-full xs:max-h-[28%] overflow-auto">

    <!-- Both player  -->
    <AtomVideoHls v-if="activePlayer == false" ref="AtomVideoHlsRef" :video-src="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />
    <AtomVideoAmalia v-else :video-src="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <!-- Input to switch between player -->
    <div class=" flex items-center text-surface-0 gap-3 justify-center pt-3">
      <InputSwitch v-model="activePlayer" class="custom-inputswitch"   />
      <b>Amalia Player</b>
    </div>

    <AtomTopicList :colors="colors" :topics="topics" />
    <slot/>
  </div>
</template>

<script setup lang="js">
  import AtomVideoHls from '../atoms/AtomVideoHls'
  import AtomTopicList from '../atoms/AtomTopicList'
  import AtomVideoAmalia from '../atoms/AtomVideoAmalia.vue';
  import { useService } from '#imports';


  const {$amalia, $application}  = useService()


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


  const updateVideoTimecode = (event) => {
    if (activePlayer.value) $amalia.updateCurrentTc($application.unixToTimestamp(event.tcin) -1 )
    else AtomVideoHlsRef.videoRef.currentTime =$application.unixToTimestamp(event.tcin) - 1 // Set video time to given timecode minus 1s to hear full segment
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
