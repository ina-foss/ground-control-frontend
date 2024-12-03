<template>
  <div class="col-span-5 flex flex-row w-full max-h-min justify-center overflow-hidden grow " >
    <div class="relative h-auto">
      <AtomProgressBar class="xs:sticky top-0"  :colors="colors" :topics="topics" :total_length="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    </div>
    <div class="flex overflow-y-auto h-[80vh]">
    <ol class=" flex flex-col overflow-y-auto h-full ">
      <ScrollTop
        :pt="{ root: { style: 'position: absolute; right: 35%; top: 88.5%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
        :threshold="100"
        :unstyled="true"
        class="absolute"
        target="parent"
      />
      <li
        v-for="(phrase, index) in locals"
        :key="index"
        :ref="el => segmentationRefs.push(el)"
        class="rounded-lg scroll-mt-5"
      >
        <AtomSegmentation
          :colors="colors"
          :index="index"
          :phrase="phrase"
          :topics="topics"
          :segmentationRefs="segmentationRefs"
          @segmentation="handleSegmentation"
          @on-segment-click="handleSegmentClick($event)"
        />
      </li>
    </ol>
    </div>
  </div>
</template>

<script setup>
  import AtomSegmentation from '../atoms/AtomSegmentation.vue'
  import AtomProgressBar from '../atoms/AtomProgressBar.vue';
  import { _ } from 'lodash';


  const { $application } = useService()
  const {  computeColor  } = $application

  const { colors, topics, locals } =  defineProps(['colors','topics','locals'])

  const emits = defineEmits([ 'on-segment-click' ]);
  const segmentationRefs = ref([])
  const segmentations= $(segmentationRefs)

  const handleSegmentation = (event) => {
    window.onbeforeunload = function () {
      return confirm("You didn't saved your progression")
    }

    if (topics[event.index] == topics[event.index+1]){
      createBreak(event.index)
    }
    else{
      console.log('remove break and fusion')
      removeBreak(event.index)
    }

    console.log(colors)
  }


  const createBreak = (index) => {
    let currentIndex = index
    let topic = newTopic(currentIndex)
    let previousTopic = topics[currentIndex]
    do{
      topics[currentIndex] = topic
      currentIndex --
    } while( (currentIndex >= 0 )  && ( previousTopic == topics[currentIndex] ) )
  }

  const removeBreak = (index) => {
    let currentIndex = index
    let previousTopic = topics[currentIndex+1]
    let removingTopic = topics[currentIndex]
    do{
      topics[currentIndex] = previousTopic
      currentIndex --
    } while( (currentIndex >= 0 )  && ( removingTopic == topics[currentIndex]  ) )
  }

  const newTopic = (index) => {
    let result
    colors.forEach((color,index)=>{
      if (index != 0 && _.findIndex(topics,(el)=> el == parseInt(index)) == -1 ) {
        result  = parseInt(index)
      }
    })
    if (!result){
      result =_.max(topics) + 1 || 1
      console.log(result)
      const randomColor = computeColor(result).hex
      colors.push(randomColor)
    }
    return result

  }

  const handleSegmentClick = (event) => {
    segmentations[event.index].scrollIntoView({ behavior: "smooth" });
    emits('on-segment-click', {tcin: event.tcin,tcout: event.tcout})
  }

  const jumpToTopic= (event) => {
    const firstIndex = topics.findIndex((topic) =>  topic == event.topic  )
    segmentations[firstIndex].scrollIntoView({ behavior: "smooth"})
  }

  const segmentationFunction = (localSubmit) => {
    localSubmit.forEach((phrase, index) => {
      if (![undefined].includes(topics[index])) {
        phrase.data.topic = topics[index]
      }
    })
    return localSubmit
  }

  defineExpose( {listRefs: segmentationRefs, annotationFunction: segmentationFunction })
</script>

<style scoped lang="postcss">

.selected-segment {
  @apply border-surface-500 border-2 ;
}

</style>
