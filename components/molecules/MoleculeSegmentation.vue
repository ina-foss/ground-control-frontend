<template>
  <div :class="`col-span-5 w-full flex justify-center relative transition-all`"  >
    <span v-if="!isAnnotationEditable" class="absolute flex w-full items-center font-bold gap-1 justify-center top-[-30px]" v-html="useRoute().query.email ? `<p>Tâche annotée par<p><span class='px-2 py-1 bg-primary text-white font-bold rounded-md'>${useRoute().query.email}</span>` : 'Tâche Terminée ✅' " ></span>
    <div :class="`${options.timecode_segment || options.number_segment ? 'w-full' : 'w-fit'} relative  justify-center flex flex-row  h-0 min-h-full transition-all`">
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
      <ol
        v-for="(phrase, index) in filteredLocals"
        :key="index"
        :ref="el => segmentationRefs.push(el)"
        :class="{'rounded-lg transition-all overflow-x-visible relative': true, 'mx-[90px] ': (options.timecode_segment || options.number_segment) }"
      >
        <AtomSegmentation
          ref="segmentation"
          :colors="colors"
          :index="index"
          :phrase="phrase"
          :topics="topics"
          :topicList="topicList"
          :segmentationRefs="segmentationRefs"
          :tcOffset="tcOffset"
          @dragging-start="(event) => { if(isAnnotationEditable) dragging.start = event.index}"
          @dragging-end="(event) => { if(isAnnotationEditable) dragging.end = event.index}"
          @segmentation="handleSegmentation"
          @on-segment-click="handleSegmentClick($event)"
          @deactivate-topic="deactivateTopic"
          @activate-topic="activateTopic"
        />
        </ol>
    </ScrollPanel>
    </div>
    </div>
  </div>
  <div class=" max-h-full flex flex-col col-span-2">
      <div class="flex-grow h-0" >
        <div class="h-full  max-w-full  flex flex-col items-center gap-3 ">
          <Tabs value="topics" class="max-w-full  grow !h-0 !max-h-full">
              <TabList  >
                <Tab value="topics"  >Topics</Tab>
                <Tab value="parameters">Paramètres</Tab>
              </TabList>
              <TabPanels class="!bg-secondary !px-0  !h-fit !max-h-[calc(100%-47px)]   !pb-2">
                <TabPanel class="max-w-full w-[320px] h-full max-h-full  flex  flex-col items-center gap-3" value="topics">
                  <AtomTopicList class="mb-3" :colors="colors" :topics="topics" @topic-click="jumpToTopic"/>
                </TabPanel>
                <TabPanel value="parameters" class="max-w-full w-[320px] flex flex-col items-center gap-3">
                  <AtomSpanOption  v-model:timecode-bloc="options.timecode_bloc"  v-model:timecode-segment="options.timecode_segment" v-model:number_segment="options.number_segment" />
                  <atom-video-option />
                  <AtomTaskComment />
                </TabPanel>
              </TabPanels>
            </Tabs>
            </div>
      </div>
    </div>
</template>

<script src="./molecule-segmentation-component" lang="ts" >
</script>

<style >
</style>
