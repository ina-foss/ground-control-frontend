<template>
  <div :class="` col-span-4 flex flex-col overflow-y-auto     `">
    <div class=" h-[40px]  mt-1 flex justify-between px-xl z-50 bg-neutral sticky top-0">
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
    <AtomSearch :spans="spanRefArray" :labels="labels" @find-span="handleFocusSpan" @unselect="handleSelection" />
    </div>
    <div v-if="options.bloc" ref="blockArray">
      <AtomTranscriptionSpan v-for="(local, index) in filteredLocal" :key="index" :local="local"  @mouseup="handleSelection" :tcOffset="tcOffset"  />
    </div>
    <div v-else>
      <div
        v-for="word in aggregatedLocals" :key="word.tcin"  :data-tc="word.tcin" :tcin="unixToTimestamp(word.tcin)"
        :tcout="unixToTimestamp(word.tcout)" :class="`inline-block  ${_.find(['.', ','], (char) => char == word.data.text[0]) ? 'pl-0' : 'pl-1'} hover:bg-surface-200`"
        @mouseup="handleSelection">
          {{ word.data.text[0] }}
      </div>
    </div>
  </div>
  <div class="  overflow-y-auto flex flex-col items-center  gap-10 col-span-2">
    <AtomSpanOption v-model:span="options.span" v-model:timecode-bloc="options.timecode_bloc" v-model:bloc="options.bloc" />
    <atom-video-option />
    <AtomSpanDetail
:relation-array="relationArray" :focus-span="currentFocus" :span-ref-array="spanRefArray"
      @link="linkMode = !linkMode" @delete-span="onDeleteSpan" @unselect="handleUnselect()"
      @focus-span="handleFocusSpan" />
  </div>
</template>

<script src="./molecule-span-component.ts" lang="ts">

</script>
