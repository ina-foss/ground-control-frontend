<template>
  <div :class="` col-span-4 flex flex-col h-full relative `">
    <div>
    <AtomSearch class='hidden'  :spans="spanRefArray" :labels="labels" @find-element="handleFocusSpan" @unselect="handleSelection" />
    </div>
    <div class="grow h-0 flex justify-center ">
    <ScrollPanel class="h-full pr-2 overflow-x-visible "
      :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'4px',
      },
    }">
    <div v-if="options.bloc" ref="blockArray" class="text-sm/4 mt-4 " >
      <AtomTranscriptionSpan v-for="(local, index) in filteredLocal" :key="index" :local="local"  @mouseup="spanForm.open(handleSelectionV2($event))"  />
    </div>
    <div v-else>
      <div
        v-for="word in aggregatedLocals" :key="word.tcin"  :data-tc="word.tcin" :tcin="unixToTimestamp(word.tcin)"
        :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${find(['.', ','], (char) => char == word.data.text[0]) ? 'pl-0' : 'pl-1'} hover:bg-surface-200`"
        @mouseup="handleSelectionv2">
          {{ word.data.text[0] }}
      </div>
    </div>
    <AtomSpanForm ref="spanForm"/>
    <ContextMenu ref="spanMenu" :model="formOptions"  />
    </ScrollPanel>
</div>
  </div>
  <div class="  overflow-y-auto  flex-col items-center  gap-10 col-span-4">
            <Tabs value="span" class="max-w-full !h-0 !max-h-full ">
              <TabList  >
                <Tab value="span"  >Spans</Tab>
                <Tab value="parameters">Paramètres</Tab>
              </TabList>
              <TabPanels class="!bg-secondary w-fit  !px-0 !h-fit !max-h-[calc(100%-47px)]  !pb-2">
                <TabPanel value="span" class="flex-col flex min-w-[700px] w-[700px] flex-1 items-center gap-3"  >
                  <AtomSpanControlPanel @handle-new-group="spanForm?.open(undefined, $event)"/>
                </TabPanel>
                <TabPanel value="parameters" class=" w-[320px] flex flex-col items-center gap-3">
                  <AtomSpanOption v-model:span="options.span"  v-model:timecode-bloc="options.timecode_bloc"   v-model:bloc="options.bloc" />
                  <atom-video-option />
                  <AtomTaskComment />
                </TabPanel>
              </TabPanels>
            </Tabs>
  </div>
</template>

<script src="./molecule-span-component.ts" lang="ts">
</script>
<style scoped lang="postcss">
.selected-segment {
  @apply border-surface-500 border-2
}
</style>
