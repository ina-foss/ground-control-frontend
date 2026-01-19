<template>
  <molecule-span-wrapper class="col-span-8 flex">
    <div :class="` flex flex-col h-full relative `">
      <div>
        <AtomSearch class='hidden'  :spans="spanArray" />
      </div>
      <div class="grow h-0 flex justify-center relative overflow-visible ">
        <span v-if="!isAnnotationEditable" class="absolute flex w-full items-center gap-2 justify-center top-[-33.5px]" v-html="useRoute().query.email ? `<p>Tâche annotée par</p><span class='py-1  font-bold rounded-md'>${useRoute().query.email}</span>` : state == TaskStatus.DONE ? 'Tâche Terminée ✅ ' : 'Mode Lecture 📖' " ></span>
        <ScrollPanel class="h-full pr-2 overflow-x-visible "
          :dt="{
          bar : {
            background: 'var(--primary-color)',
            size:'4px',
          },
        }">
          <div v-if="options.bloc" ref="blockArray" class="text-sm/4 p-lg bg-grey-150 rounded-md gap-sm flex flex-col" >
            <AtomTranscriptionSpan v-for="(local, index) in filteredLocal" :key="index" :local="local"  @mouseup="isAnnotationEditable && spanForm.open(handleSelectionV2($event))" @handle-word-click="handleWordClick({...$event,index})"  />
          </div>
          <div v-else>
            <div
              v-for="word in aggregatedLocals" :key="word.tcin"  :data-tc="word.tcin" :tcin="unixToTimestamp(word.tcin)"
              :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${find(['.', ','], (char) => char == word.data.text[0]) ? 'pl-0' : 'pl-1'} hover:bg-surface-200`"
              @mouseup="isAnnotationEditable && handleSelectionV2">
                {{ word.data.text[0] }}
            </div>
          </div>
          <AtomSpanForm ref="spanForm" @new-group="focusGroup($event) & moleculeSpanControlPanelRef.showPanel(['currentGroup','groupList']) "/>
          <ContextMenu v-if="isAnnotationEditable" ref="spanMenu" :model="contextMenuOptions"  />
        </ScrollPanel>
      </div>
    </div>
    <div class="flex flex-col items-center w-full h-full gap-10 overflow-hidden ">
              <Tabs value="span" class="w-full h-full flex flex-col">
                <TabList  >
                  <Tab value="span">Spans</Tab>
                  <Tab value="parameters">Paramètres</Tab>
                </TabList>
                <ScrollPanel class="pr-2 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-170px)]" :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'5px'
      },
      barY:{
        style : 'right: -10px;'
        }
    }">
                <TabPanels class="!bg-secondary  w-full !pl-0 !pb-2 flex-1">
                  <TabPanel value="span" class="flex-col flex flex-1 items-center gap-3">
                    <MoleculeSpanControlPanel
                    :is-annotation-editable="isAnnotationEditable"
                    ref="moleculeSpanControlPanelRef"/>
                  </TabPanel>
          <TabPanel value="parameters" class=" !w-full grid items-center gap-3"   >
                      <option-wrapper class="  grid gap-2" style="grid-template-columns: repeat(auto-fit,minmax(250px,1fr))">
                        <AtomSpanOption v-model:span="options.span"  v-model:timecode-bloc="options.timecode_bloc"   v-model:bloc="options.bloc" />
                        <atom-video-option />
                        <AtomTaskComment />
                    </option-wrapper>
                  </TabPanel>
                </TabPanels>
                </ScrollPanel>
              </Tabs>
    </div>
  </molecule-span-wrapper>
</template>

<script src="./molecule-span-component.ts" lang="ts">
</script>
<style scoped lang="postcss">
.selected-segment {
  @apply border-surface-500 border-2
}
</style>
