<template>
  <div style="background-color: #212529" class="col-span-3 px-5 py-5 h-full max-h-full xs:max-h-[28%] overflow-auto">

    <AtomVideoAmalia :video-src="videoSrc" :locals="locals" @timecode-update="emits('scroll-to-segment',$event)" />

    <AtomTopicList :colors="colors" :topics="topics" />
    <slot/>
  </div>
</template>

<script setup lang="js">
  import AtomTopicList from '../atoms/AtomTopicList'
  import AtomVideoAmalia from '../atoms/AtomVideoAmalia.vue';
  import { useService } from '#imports';


  const {$amalia, $application}  = useService()

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

  const emits = defineEmits(['scroll-to-segment'])


  const updateVideoTimecode = (event) => {
    $amalia.updateCurrentTc($application.unixToTimestamp(event.tcin) -1 )
  }

  defineExpose({updateVideoTimecode})
</script>
