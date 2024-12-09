<template>
  <div class="col-span-4 flex flex-row w-full max-h-min justify-center overflow-hidden grow " >
    <div class="relative h-auto">
      <AtomProgressBar class="xs:sticky top-0"  :colors="colors" :topics="topics" :topicList="topicList" :totalLength="locals.length" @progress-bar-jump="jumpToTopic($event)" />
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
        v-for="(phrase, index) in filteredLocals"
        :key="index"
        :ref="el => segmentationRefs.push(el)"
        class="rounded-lg scroll-mt-5"
      >
        <AtomSegmentation
          ref="segmentation"
          :colors="colors"
          :index="index"
          :phrase="phrase"
          :topics="topics"
          :topicList="topicList"
          :segmentationRefs="segmentationRefs"
          @segmentation="handleSegmentation"
          @on-segment-click="handleSegmentClick($event)"
          @deactivate-topic="deactivateTopic"
        />
      </li>
    </ol>
    </div>
  </div>
</template>

 <script src="./molecule-segmentation-component" lang="ts" >
</script>

<style scoped lang="postcss">

.selected-segment {
  @apply border-surface-500 border-2 ;
}

</style>
