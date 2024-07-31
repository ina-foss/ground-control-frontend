<template>
  <div class="col-span-5 flex flex-row w-full max-h-full justify-center overflow-y-hidden" >
    <AtomProgressBar :colors="colors" :topics="topics" :total_length="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    <ol class="flex flex-col overflow-y-auto h-full ">
      <ScrollTop
        :pt="{ root: { style: 'position: absolute; right: 25%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
        :threshold="100"
        :unstyled="true"
        class="absolute"
        target="parent"
      />
      <!-- TODO: use VitualScroller -->
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
  import AtomProgressBar from '../atoms/AtomProgressBar.vue';

  const { colors, topics, locals } =  defineProps(['colors','topics','locals'])

  const emits = defineEmits([ 'on-segment-click' ]);

  const segmentationRefs = $ref([])

  const handleSegmentation = () => {
    window.onbeforeunload = function () {
      return confirm("You didn't saved your progression")
    }
  }

  const handleSegmentClick = (event) => {
    segmentationRefs[event.index].scrollIntoView({ behavior: "smooth" });
    emits('on-segment-click', {tcin: event.tcin})
  }

  const jumpToTopic= (event) => {
    const firstIndex = topics.findIndex((topic) =>  topic == event.topic )
    segmentationRefs[firstIndex].scrollIntoView({ behavior: "smooth"})
  }

  defineExpose( {segmentationRefs: $$(segmentationRefs) })
</script>

<style scoped lang="postcss">

.selected-segment div{
  @apply border-surface-500 border-2 ;
}

</style>
