<template>
  <div class="col-span-4 flex flex-row grow-0 w-full h-0 min-h-full justify-center" >
    <div class="relative h-full ">
      <AtomProgressBar class="xs:sticky top-0"  :colors="colors" :topics="topics" :topicList="topicList" :totalLength="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    </div>
    <ScrollPanel class="w-full pr-2"
      :dt="{
      bar : {
        background: 'var(--primary-color)',
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
      <ScrollTop
        :pt="{ root: { style: 'position: fixed !important; right: 42%; top: 88.5%; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
        :threshold="100"
        target="parent"
      />
      <ol
        v-for="(phrase, index) in filteredLocals"
        :key="index"
        :ref="el => segmentationRefs.push(el)"
        class="rounded-lg scroll-mt-52 "
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
        </ol>
    </ScrollPanel>
  </div>
    <div class=" h- overflow-y-scroll flex flex-col items-center gap-3 col-span-2 mb-3">
      <AtomSpanOption  v-model:timecode-bloc="options.timecode_bloc"  v-model:timecode-segment="options.timecode_segment" />
      <atom-video-option />
      <AtomTaskComment />
      <AtomTopicList :colors="colors" :topics="topics"/>
      <AtomTimecodeList />
    </div>
</template>

<script src="./molecule-segmentation-component" lang="ts" >
</script>

