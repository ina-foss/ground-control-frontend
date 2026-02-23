<template>
  <div :class="[ 'flex-col flex pl-5 max-h-full', panelSize  ]">

    <AtomVideoAmalia ref="videoPlayer"  v-model:focusPlayer="isPlayerFocused" :video-src="videoSrc" :media_params="media_params" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <slot/>
  </div>
</template>

<script setup lang="js">
  import AtomVideoAmalia from '../atoms/videoAmalia/AtomVideoAmalia.vue';
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
    },
    panelSize: {
      type: String,
      default : 'large'
    }
  });
  const { locals, videoSrc, panelSize } = props;


  const videoPlayer = ref(AtomVideoAmalia|null)
  const scrollToSegment = inject('scrollToSegment')
  const emits = defineEmits(['scroll-to-segment'])
  const isPlayerFocused = inject('isPlayerFocused')

  const pauseTime = ref(0); // variable réactive
  const currentTime = ref(0);

  const updateVideoTimecode = (event) => {
    $amalia.updateCurrentTc($application.unixToTimestamp(event.tcin) )
    pauseTime.value=$application.unixToTimestamp(event.tcout)
    $amalia.onPlay()
  }

  const checkCurrentTime = () => {
      currentTime.value = $amalia.callSeek();
  };
  onMounted(() => {
    const interval = setInterval(() => {
      checkCurrentTime();
    }, 200);

    onUnmounted(() => {
      clearInterval(interval);
    });
  });

  watch(()=>currentTime.value, (newCurrentTime) => {
    if (pauseTime.value !== 0 && options.loop_bloc &&  ((!options.jump_after_offset &&  newCurrentTime >= pauseTime.value) || newCurrentTime >=pauseTime.value + options.jump_after_offset ) )  {
      $amalia.onPause();
      pauseTime.value=0;
    }
  });

  watch(()=>currentTime.value, (time, oldTime) => {
    if(options.player && time != undefined && Math.abs(time-oldTime)< 1 ) {
        videoPlayer.value.seek(true)
    }
  })


  provide("videoPlayer", videoPlayer);
  defineExpose({ updateVideoTimecode, videoPlayer });
</script>
