<template>
  <div class="col-span-4 flex flex-row w-full h-0 min-h-full" >
    <div class="relative max-h-full ">
      <AtomProgressBar class="xs:sticky top-0"  :colors="colors" :topics="topics" :topicList="topicList" :totalLength="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    </div>
    <div class="overflow-y-clip h-full">
    <ScrollPanel class="h-full pr-2"
      :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'4px'
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
      <div
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
        </div>
    </ScrollPanel>
    </div>
  </div>
    <div class=" flex flex-col col-span-2">
      <div class="flex-grow h-0 overflow-y-clip pb-1" >
          <ScrollPanel class="h-full pr-3" :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'3px'
      },
      barY:{
        style : 'right: 10px;'
        }
    }">
            <div class="h-full flex flex-col items-center gap-3">
              <AtomSpanOption  v-model:timecode-bloc="options.timecode_bloc"  v-model:timecode-segment="options.timecode_segment" />
              <atom-video-option />
              <AtomTaskComment />
              <AtomTimecodeList />
              <AtomTopicList class="mb-2" :colors="colors" :topics="topics"/>
            </div>
          </ScrollPanel>
      </div>
    </div>
</template>

<script src="./molecule-segmentation-component" lang="ts" >
</script>

