<template>
  <div class="col-span-5 flex flex-row w-full max-h-full justify-center overflow-y-hidden" >
    <ProgressBar :colors="colors" :topics="topics" :total_length="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    <ol class="flex flex-col gap-5 overflow-y-auto h-full py-4">
      <ScrollTop
        :pt="{ root: { style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
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
          @segmentation="handleSegmentation()"
          @on-segment-click="handleSegmentClick($event)"
        />
      </li>
    </ol>
  </div>
</template>

<script setup>
  import AtomSegmentation from '../atoms/AtomSegmentation.vue'

  const { colors, topics, locals } =  defineProps(['colors','topics','locals'])

  const segmentationRefs = $ref([])

  const handleSegmentation = () => {
    window.onbeforeunload = function () {
      return confirm("You didn't saved your progression")
    }
  }

  const handleSegmentClick = (event) => {
    segmentationRefs[event.index].scrollIntoView({ behavior: "smooth" });
    video.currentTime = unixToTimestamp(event.tcin)
  }

  const jumpToTopic= (event) => {
    const firstIndex = topics.findIndex((topic) =>  topic == event.topic )
    segmentationRefs[firstIndex].scrollIntoView({ behavior: "smooth"})
  }

  function unixToTimestamp(tc) { // Conversion du format 'HH:MM:SS.mmmm' vers le timecode en seconde
    const millisecond = tc.split('.')[1]
    const timeArray = tc.split('.')[0].split(':')
    const videoTime = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]) + (parseInt(millisecond) / 1000)
    return videoTime
  }

</script>

<style scoped lang="postcss">

.selected-segment{
  @apply border-black border-2;
}

</style>
