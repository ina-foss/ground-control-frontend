<template>
  <div :class="`col-span-5 w-full flex justify-center relative transition-all`"  >
    <div :class="`${options.timecode_segment ? 'w-full' : 'w-fit'} relative  justify-center flex flex-row  h-0 min-h-full transition-all`">
    <div class="h-full  left-0 top-0 transition-all  ">
      <AtomProgressBar class="xs:sticky top-0 transition-all"  :colors="colors" :topics="topics" :topicList="topicList" :totalLength="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    </div>
    <div class="overflow-y-clip overflow-visible h-full flex-grow flex justify-center   ">
    <ScrollPanel class="h-full pr-2 overflow-x-visible "
      :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'4px',
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
      <ScrollTop
        :pt="{ root: { style: 'position: fixed !important; right: calc(22%) ; bottom: 30px ; border-radius: 1000px; width: 2rem; height: 2rem; background-color: black' } }"
        :threshold="100"
        target="parent"
      />
      <div
        v-for="(phrase, index) in filteredLocals"
        :key="index"
        :ref="el => segmentationRefs.push(el)"
        :class="{'rounded-lg transition-all overflow-x-visible relative': true, 'mx-[78px] ': options.timecode_segment }"
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
          @activate-topic="activateTopic"
        />
        </div>
    </ScrollPanel>
    </div>
    </div>
  </div>
    <div class=" max-h-full flex flex-col col-span-2">
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
        <div class="max-h-full  max-w-full w-[300px] flex flex-col items-center gap-3">
              <AtomSpanOption  v-model:timecode-bloc="options.timecode_bloc"  v-model:timecode-segment="options.timecode_segment" />
              <atom-video-option />
              <AtomTaskComment />
              <AtomTopicList class="mb-2" :colors="colors" :topics="topics" @topic-click="jumpToTopic"/>
            </div>
          </ScrollPanel>
      </div>
    </div>
</template>

<script src="./molecule-segmentation-component" lang="ts" >
</script>

<style >
</style>
