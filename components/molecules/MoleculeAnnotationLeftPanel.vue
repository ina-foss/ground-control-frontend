<template>
  <div style="background-color: #212529" class="col-span-3 px-5 py-5 h-full xs:max-h-[28%] overflow-auto">

    <AtomVideoAmalia :video-src="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <slot/>
  </div>
</template>

<script setup lang="js">
  import AtomTopicList from '../atoms/AtomTopicList'
  import AtomVideoAmalia from '../atoms/AtomVideoAmalia.vue';
  import { useService } from '#imports';


  const {$amalia, $application}  = useService()
  const { options } = useOptions()

  const props = defineProps({
    data: {
      type: Object,
      default: () => null
    },
    locals: {
      type: Object,
      default: () => null
    },
    videoSrc: {
      type: String,
      default: ''
    }
  });
const { locals, videoSrc } = props;

  const emits = defineEmits(['scroll-to-segment'])

  const pauseTime = ref(0); // variable réactive
  const currentTime = ref(0);
  const updateVideoTimecode = (event) => {
    $amalia.updateCurrentTc($application.unixToTimestamp(event.tcin) )
    pauseTime.value=$application.unixToTimestamp(event.tcout)
  }

  const checkCurrentTime = () => {
    currentTime.value = $amalia.callSeek();
  };
  onMounted(() => {
    const interval = setInterval(() => {
      checkCurrentTime();
    }, 500);

    onUnmounted(() => {
      clearInterval(interval);
    });
  });

  watch(currentTime, (newCurrentTime) => {
    if (pauseTime.value !== 0 && newCurrentTime >= pauseTime.value && options.loop_bloc) {
      $amalia.onPause();
      pauseTime.value=0;
    }
  });

  defineExpose({updateVideoTimecode})
</script>
