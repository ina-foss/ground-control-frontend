<template >
  <div class="@container h-full w-full flex">
  <AtomHelp class="fixed z-[1000]" />
  <div class="  w-full flex justify-center relative transition-all h-full"  >
    <span v-if="!isAnnotationEditable" class="absolute flex w-full items-center gap-2 justify-center top-[-37.5px]" v-html="useRoute().query.email ? `<p>Tâche annotée par</p><span class='py-1  font-bold rounded-md'>${useRoute().query.email}</span>` : 'Tâche Terminée ✅' " ></span>
    <div :class="`${options.timecode_segment || options.number_segment ? 'w-full' : 'w-fit'} relative  justify-center flex flex-row  h-0 min-h-full transition-all`">
    <div class="h-full  left-0 top-0 transition-all  ">
      <AtomProgressBar class="xs:sticky top-0 transition-all"  :colors="colors" :topics="topics" :topic-list="topicList" :total-length="locals.length" @progress-bar-jump="jumpToTopic($event)" />
    </div>
    <div class="overflow-y-clip overflow-visible h-full flex-grow flex justify-center   ">
    <ScrollPanel class="h-full pr-2 overflow-x-visible " >
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
          :topic-list="topicList"
          :segmentation-refs="segmentationRefs"
          :tc-offset="tcOffset"
          :transcriptions="transcriptions"
          @dragging-start="handleDragStart"
          @dragging-end="handleDragEnd"
          @segmentation="handleSegmentation($event)"
          @on-segment-click="handleSegmentClick"
          @deactivate-topic="deactivateTopic({index})"
          @activate-topic="activateTopic({index})"
          @create-span="spanForm.open(handleSelectionV2($event))"
        />
        </ol>
      <ScrollTop
        :threshold="10"
        target="parent"
      />
    </ScrollPanel>
    <AtomSpanForm ref="spanForm"/>
    <ContextMenu ref="spanMenu" :model="contextMenuOptions"  />
    </div>
    </div>
  </div>
  <div class=" @max-[900px]:hidden flex  max-h-full h-full flex-col px-xl basis-200 ">
      <div class="flex-grow h-0" >
        <div class="h-full  max-w-full  flex flex-col items-center gap-3 ">
          <Tabs value="topics" class=" w-full  grow !h-0 !max-h-full">
              <TabList  >
                <Tab value="topics"  >Topics</Tab>
                <Tab value="parameters">Paramètres</Tab>
              </TabList>
              <TabPanels class="!bg-secondary !px-0  !pb-2 h-full">
                <TabPanel class="max-w-full  h-fit max-h-full  flex  flex-col items-center gap-3" value="topics">
                  <AtomTopicList class="mb-3" :topics="topics" @topic-click="jumpToTopic"/>
                </TabPanel>
                <TabPanel value="parameters" class="max-w-full flex flex-col items-center gap-3">
                  <AtomSpanOption  v-model:timecode-bloc="options.timecode_bloc"  v-model:timecode-segment="options.timecode_segment" v-model:number_segment="options.number_segment" />
                  <atom-video-option />
                  <AtomTaskComment />
                </TabPanel>
              </TabPanels>
            </Tabs>
            </div>
      </div>
    </div>
  </div>
</template>

<script src="./molecule-segmentation-component" lang="ts" >
</script>

<style >
</style>
