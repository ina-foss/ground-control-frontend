<template>
  <div class=" flex-col flex col-span-3 pl-5 max-h-full ">

    <AtomVideoAmalia ref="videoPlayer" class="rounded-lg h-full" :video-src="videoSrc" :media_params="media_params" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <slot/>
  </div>
</template>

<script setup lang="js">
  import AtomVideoAmalia from '../atoms/AtomVideoAmalia.vue';
  import { useService } from '#imports';


  const {$amalia, $application}  = useService()
  const { options } = useOptions()

  const props = defineProps({
    media_params: {
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

  const videoPlayer = ref(AtomVideoAmalia|null)
  provide("videoPlayer", videoPlayer);
  defineExpose({ updateVideoTimecode, videoPlayer });
</script>
