<template>
  <div :class="[ 'flex-col flex pl-5 max-h-full', panelSize  ]">

    <AtomVideoAmalia ref="videoPlayer"  v-model:focus-player="isPlayerFocused" :video-src="videoSrc" :media_params="media_params" :media_type="media_type" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <slot/>
  </div>
</template>

<script setup lang="js">
  import AtomVideoAmalia from '../atoms/videoAmalia/AtomVideoAmalia.vue';
  import { useService } from '#imports';
  import { usePlayer } from '~/composables/usePlayer';


  const {$application}  = useService()
  const { options } = useOptions()

  let $amalia



  const props = defineProps({
    media_params: {
      type: Object,
      default: () => null
    },
    media_type: {
      type: MediaType
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
  const { locals, videoSrc, media_type, panelSize } = props;


  const videoPlayer = ref(AtomVideoAmalia|null)
  const scrollToSegment = inject('scrollToSegment')
  const emits = defineEmits(['scroll-to-segment'])
  const isPlayerFocused = inject('isPlayerFocused')

  const pauseTime = ref(0); // variable réactive
  const currentTime = ref(0);

  const updateVideoTimecode = (event) => {
    $amalia.updateCurrentTc($application.unixToTimestamp(event.tcin) )
    pauseTime.value=$application.unixToTimestamp(event.tcout)
    if(!event.fromSpan){
      $amalia.onPlay()
    }
    else{
      $amalia.onPause()
    }

  }

  const checkCurrentTime = () => {
      currentTime.value = $amalia.callSeek();
  };
  onMounted(async() => {
    $amalia = await usePlayer()
    const interval = setInterval(() => {
      checkCurrentTime();
    }, 200);

    onUnmounted(() => {
      clearInterval(interval);
    });
  });

  watch(()=>currentTime.value,(newTime,oldTime) => {
    if( oldTime == 0 && newTime > 0 ){
        scrollToSegment({bestIndex: 0})
    }
  })

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
