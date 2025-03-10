<template>
  <div :class="` col-span-5 flex flex-col h-full relative `">
    <div class=" h-[40px]  flex justify-between px-xl z-50 absolute top-[-40px]  w-full  ">
      <div class=" flex items-center gap-5 overflow-hidden relative">
        <SelectButton v-model="labelSelected" multiple  :options="labels" aria-labelledby="basic" >
        <template #option="slotProps"  >
            <span >
            {{ slotProps.option}}
            </span>
            <i @click.stop="_.pullAt(labels,slotProps.index)" class="pi pi-times absolute right-[-15px] top-[-8px] z-50 rounded-2xl p-[2px] text-[8px] overflow-visible hover:cursor-pointer hover:bg-disabled "  />
        </template>
          </SelectButton>
        <div class="flex overflow-visible w-[120px] gap-1 items-center">
          <div class="grow-0">
            <InputText v-model="newLabel" class="h-full w-full " />
          </div>
          <div class="grow">
            <Button icon="pi pi-plus grow " @click="addLabel()" :disabled="newLabel == ''" />
          </div>
        </div>
      </div>
    <AtomSearch :spans="spanRefArray" :labels="labels" @find-element="handleFocusSpan" @unselect="handleSelection" />
    </div>
    <div class="grow h-0 flex justify-center ">
    <ScrollPanel class="h-full pr-2 overflow-x-visible "
      :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'4px',
      },
    }">
    <div v-if="options.bloc" ref="blockArray">
      <AtomTranscriptionSpan v-for="(local, index) in filteredLocal" :key="index" :local="local"  @mouseup="handleSelection"  />
    </div>
    <div v-else>
      <div
        v-for="word in aggregatedLocals" :key="word.tcin"  :data-tc="word.tcin" :tcin="unixToTimestamp(word.tcin)"
        :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${_.find(['.', ','], (char) => char == word.data.text[0]) ? 'pl-0' : 'pl-1'} hover:bg-surface-200`"
        @mouseup="handleSelection">
          {{ word.data.text[0] }}
      </div>
    </div>
    </ScrollPanel>
</div>
  </div>
  <div class="  overflow-y-auto flex flex-col items-center  gap-10 col-span-2">
            <Tabs value="span" class="max-w-full  grow !h-0 !max-h-full">
              <TabList  >
                <Tab value="span"  >Spans</Tab>
                <Tab value="parameters">Paramètres</Tab>
              </TabList>
              <TabPanels class="!bg-secondary !px-0  !h-fit !max-h-[calc(100%-47px)]   !pb-2">
                <TabPanel value="span" class="max-w-full w-[320px] h-full max-h-full  flex  flex-col items-center gap-3"  >
                  <AtomSpanDetail :relation-array="relationArray" :focus-span="currentFocus" :span-ref-array="spanRefArray"
                    @link="linkMode = !linkMode" @delete-span="onDeleteSpan" @unselect="handleUnselect()"
                    @focus-span="handleFocusSpan" />
                </TabPanel>
                <TabPanel value="parameters" class="max-w-full w-[320px] flex flex-col items-center gap-3">
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
