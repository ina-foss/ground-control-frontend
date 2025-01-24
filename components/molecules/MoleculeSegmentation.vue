<template>
  <div class="col-span-4 flex flex-row w-full max-h-min justify-center grow " >
    <div class="relative h-auto">
      <AtomProgressBar class="xs:sticky top-0"  :colors="colors" :topics="topics" :topicList="topicList" :totalLength="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    </div>
    <div class="flex  h-[80vh]">
    <ol class=" flex  flex-col w-fit h-full overflow-y-scroll overflow-x-visible pr-4">
      <ScrollTop
        :pt="{ root: { style: 'position: absolute; right: 42%; top: 95%; width: 2rem; height: 2rem;',
         class:['p-button-secondary','p-button-rounded']} }"
        :threshold="100"
        :unstyled="true"
        class="absolute"
        target="parent"
      />
      <li
        v-for="(phrase, index) in filteredLocals"
        :key="index"
        :ref="el => segmentationRefs.push(el)"
        class="rounded-lg scroll-mt-5 "
      >
        <AtomSegmentation
          ref="segmentation"
          :colors="colors"
          :index="index"
          :phrase="phrase"
          :topics="topics"
          :topicList="topicList"
          :segmentationRefs="segmentationRefs"
          @dragging-start="dragging.start = $event.index"
          @dragging-end="dragging.end = $event.index"
          @segmentation="handleSegmentation"
          @on-segment-click="handleSegmentClick($event)"
          @deactivate-topic="deactivateTopic"
        />
      </li>
    </ol>
    </div>
  </div>
    <div class=" h-[80vh] overflow-y-scroll flex flex-col items-center gap-3 col-span-2 mb-3">
      <AtomSpanOption v-model:span="options.span" v-model:timecode="options.timecode" v-model:bloc="options.bloc" :showSpan="false" :showBloc="false" />
      <atom-video-option />
      <AtomTaskComment />
      <AtomTopicList :colors="colors" :topics="topics"/>
    </div>
</template>

<script src="./molecule-segmentation-component" lang="ts" >
</script>
