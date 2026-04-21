<template xmlns="http://www.w3.org/1999/html">
  <div :style="`${dynamicStyle(computeColor(topicIndex).hex)} `" ref="segment" :tcin="phrase.tcin" :data-drag-over="isDragOver"  @dragstart="startDrag"
    @dragover="computeDrag" @dragenter="previewDrop" @dragleave="handleDragLeave" @drop="handleDrop" @dragend="endDrag"
    :class="`bg-gray-300 transition-all ${index == 0 ? '!mt-0': ''}  group relative mt-3 max-w-[700px] last:gap-0 px-sm pt-sm ${topicIndex == undefined || isTopicsLastSegment ? 'pb-sm' : ''} flex flex-col ${topicIndex == 0 ? 'text-gray-400' : ''} ${isTopicFirstSegment || topicIndex == undefined ? 'rounded-t-lg ' : ' scroll-mt-16'} ${isTopicsLastSegment ? 'rounded-b-lg' : ''} `">
    <div v-if="isTopicFirstSegment" ref="firstSegmentPadding" :class="`flex transition-all  justify-center items-center h-[40px] sticky top-0  w-fit`">
    </div>
    <div v-if="isTopicFirstSegment" ref="titleContainer"
      class=" w-[calc(100%)] pointer-events-none absolute flex justify-center z-50 top-0 left-0   ">
      <div ref="topicHeader" :class="`w-full sticky top-[-1px] min-h-[54px] h-fit left-0 bg-secondary rounded-t-lg pointer-events-auto z-50 transition-all `">
        <div
class="w-full flex h-full  p-sm  rounded-t-lg "
          :style="`${applyHeaderColor(computeColor(topicIndex).hex)} `">
          <div class="flex flex-col w-full gap-2">
          <div class="flex flew-row items-center justify-between w-full max-w-full min-h-11" >
              <Tag
v-if="options.timecode_bloc" :severity=" transcriptions[findIndex(autoSummaries,t=>t[0].data.topic == topicIndex )] ? 'success' : 'contrast'"
                :class="{ 'cursor-pointer' : jumpToTopic}"
                @click="jumpToTopic ? jumpToTopic({topic:topicIndex }): ()=>false"
              >
              <div class="flex justify-center  items-center gap-3">
                <i class="pi pi-clock" />
                <p class="text-sm">{{timestampToUnix(phrase.tcin) }}</p>
              </div>
            </Tag>
            <div v-if="topicIndex > 0 && isTopicFirstSegment" class="flex flex-col grow  justify-between text-ellipsis  line-clamp-2  ">
              <div class="flex items-center gap-2 justify-start h-full " >
                <div v-if="editTitle">
                  <InputText v-model="editedTitle" @focusout="editTitle = false" />
                </div>
                <div v-else-if="topicIndex > 0 && isTopicFirstSegment" class="flex gap-2 h-full items-center shrink text-ellipsis  line-clamp-2   ">
                  <div
v-tooltip.bottom="{ value: title, showDelay: 400, class: 'single-line-tooltip' }"
                    :class="`h-full pl-3 text-ellipsis  line-clamp-2 flex `">

                      <p  class="text-ellipsis font-bold line-clamp-2"> {{title }} </p>

                  </div>
                  <Button v-if="isAnnotationEditable" class="min-w-[33px] "  icon="pi pi-pencil" severity="contrast" text @click="editTitle = true" />
                </div>
                <AtomPluginBlock
v-model:plugin-values="pluginValues" :topic-index="topicIndex" :is-topic-first-segment="isTopicFirstSegment"
                  :chip-list="chipList" />
                </div>
            </div>
            <div v-else="topicIndex == 0 && isTopicFirstSegment" class="h-8">
              <div
                :class="`h-8 p-3  w-fit flex items-center mb-3 text-${textColorPicker(computeColor(topicIndex).hex)} `">
                <b>Ignoré</b>
              </div>
            </div>
            <div v-if="showSecondaryButtons">
              <Button class="min-w-[33px] " icon="pi pi-ellipsis-h" severity="contrast" text :disabled="!isAnnotationEditable" @click="dialogVisible = true" />
              <Button severity="contrast" icon="pi pi-ban" text @click="emit('deactivateTopic', { index: index })" />
              <Button severity="contrast" icon="pi pi-check" text @click="emit('activateTopic', { index: index })" />
            </div>
            <AtomPluginAutocompleteList v-model:plugin-values="pluginValues" :phrase="phrase" :title="title" :topic-index="topicIndex" :is-topic-first-segment="isTopicFirstSegment" :dialog-visible="dialogVisible" @toggle-dialog="dialogVisible = false"/>
          </div>
              <div v-if=" chipList?.length > 0 " class="px-2 py-1 border-dashed border border-black inline-flex flex-wrap gap-2  ">
                <Chip
v-for="(chip, index) in chipList" :key="chip.label" :label="chip.label" :removable="isAnnotationEditable"
                  @remove="handleRemove(index)" />
              </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="commentWrapper"  :class="`absolute  ${isTopicFirstSegment? 'top-[53px]' : 'top-[3px]'}  right-[4px]`" >
    <OverlayBadge
v-if="phrase.data.comments?.length > 0" :value="phrase.data.comments?.length"
                  :class="`overflow-visible  z-[60] !transition !duration-500 $  `">
      <Button class="!bg-primary !border-primary"  @click="toggleComment">
        <img style="height:14px;width:14px;" :src="commentIcon" alt="comment icon" >
      </Button>
    </OverlayBadge>
    <Button
v-else-if="isAnnotationEditable"
      :class="`  opacity-0 hover:!bg-primary hover:!border-primary  group-hover:opacity-30 hover:!opacity-100 z-[60] !transition !duration-500  `"
      @click="toggleComment" >
      <img style="height:14px;width:14px;" :src="commentIcon" alt="comment icon" >
    </Button>
    </div>
    <div
      :class="`bg-white relative p-3 ${isTopicFirstSegment? 'mt-[10px]' : ' '} z-40 isolate  text-sm col-auto grow rounded-md cursor-pointer transition-all relative hover:shadow-lg `"
      @mouseup="$emit('on-segment-click', { tcin: phrase.tcin, tcout: phrase.tcout, index: index})">
      <AtomTranscriptionSpan v-if="annotation_type=='auto-summary'" :key="index" :local="phrase"  @mouseup="emit('create-span',$event)" />
        <p v-else class="customText">{{ $props.phrase.data?.text[0] }}</p>
      <div
v-if="options.timecode_segment"
           class="absolute flex items-center h-full top-0 z-50 text-xs overflow-visible"
           :class="{'left-[-90px]': tcOffset === 0, 'left-[-102px]': tcOffset !== 0}">
        <p class="border-dashed border border-title py-1 px-2 rounded-sm">
          {{ timestampToUnix(phrase.tcin) }}
        </p>
      </div>
      <div
v-if="options.number_segment"
           class="absolute flex items-center h-full top-[0] left-[-70px] z-50 text-xs overflow-visible    ">
        <p class="border-dashed border border-title py-1 px-2 rounded-sm ">{{ index }}</p>
      </div>
    </div>
    <div class="relative gap-0  w-[calc(100%+20px)] z-40 ">
      <div
        :class="`absolute z-50 w-full left-[-10px] h-6 over pointer-events-auto cursor-pointer  transition rounded-full`"
        @click="handleSegmentation">
        <div ref="ruptureTemplate" v-if="isAnnotationEditable"
          :class="` justify-center w-full border-t-2 border-dashed text-white relative drag-over:flex  h-0 ${isDragOver ? 'flex' : 'hidden group-hover:flex' }  ${isTopicsLastSegment && topicIndex != undefined ? 'border-t-primary' : ' border-t-error'}  translate-y-[10px] group-hover:flex items-center   transition`">
          <i v-if="!isTopicsLastSegment || topicIndex == undefined"
            class="pi pi-hashtag  translate-y-[-1px] bg-error p-[5px] rounded  hover:bg-red-600 " />
          <div v-else class="flex justify-around w-[80px]">
            <div
v-tooltip.left="{ value: 'Déplacer une rupture', showDelay: 400 }" style="height:24px;width:24px;"
              :draggable="isTopicsLastSegment && topics[topicIndex]!=null"
              class=" bg-primary  cursor-ns-resize rounded hover:bg-[#0C7DA2] flex items-center justify-center">
              <img
style="height:16px;width:16px;" class="pointer-events-none"
                src="/icons/icons-svg/icons-svg/move-icon.svg"
                alt="move icon" >
            </div>
            <div
v-tooltip.right="{ value: 'Supprimer une rupture', showDelay: 400 }" style="height:24px;width:24px; "
              class=" bg-red-500  cursor-pointer rounded hover:bg-red-600 flex items-center justify-center">
              <img
style="height:16px;width:16px;" src="/icons/icons-svg/icons-svg/trash-icon.svg"
                alt="delete icon" >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Popover ref="comment">
    <AtomComment :phrase="phrase" :overlay="comment" />
  </Popover>
</template>

<script lang="ts" src="./atom-segmentation-component.ts"></script>

<style scoped lang="postcss">

.selected-segment > div {
  @apply border-surface-500 border-2 ;
}

img{
   -webkit-filter: invert(.75); /* safari 6.0 - 9.0 */
          filter: invert(1);
}

</style>

<style >
  @reference "tailwindcss";

  @custom-variant drag-over (:where([data-drag-over="true"]) &, [data-drag-over="true"] &);

  .single-line-tooltip {
    white-space: nowrap !important;
    max-width: none !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
