<template xmlns="http://www.w3.org/1999/html">
  <div :style="dynamicStyle(colors[topicIndex])" ref="segment" :tcin="phrase.tcin" @dragstart="startDrag"
    @dragover="computeDrag" @dragenter="previewDrop" @dragleave="handleDragLeave" @drop="handleDrop" @dragend="endDrag"
    :class="`bg-gray-300 transition-all ${index == 0 ? '!mt-0': ''}  group relative mt-3 max-w-[700px] last:gap-0 px-sm pt-sm ${topicIndex == undefined || isTopicsLastSegment ? 'pb-sm' : ''} flex flex-col ${topicIndex == 0 ? 'text-gray-400' : ''} ${isTopicFirstSegment || topicIndex == undefined ? 'rounded-t-lg' : ''} ${isTopicsLastSegment ? 'rounded-b-lg' : ''} `">
    <div v-if="isTopicFirstSegment" ref="firstSegmentPadding" :class="`flex transition-all  justify-center items-center h-[40px] sticky top-0  w-fit`">
    </div>
    <div v-if="isTopicFirstSegment" ref="titleContainer"
      class=" w-[calc(100%)] pointer-events-none absolute flex justify-center z-50 top-0 left-0   ">
      <div ref="topicHeader" :class="`w-full sticky top-[-1px] min-h-[54px] h-fit left-0 bg-secondary rounded-t-lg pointer-events-auto z-50 transition-all `">
        <div class="w-full flex h-full  p-sm  rounded-t-lg "
          :style="`${applyHeaderColor(computeColor(topicIndex).hex)} `">
          <div class="flex flex-col w-full gap-2">
          <div class="flex flew-row items-center justify-between w-full max-w-full" >
            <Tag v-if="options.timecode_bloc" severity="contrast">
              <div class="flex justify-center  items-center gap-3">
                <i class="pi pi-clock" />
                <p class="text-sm">{{$application.timestampToUnix(phrase.tcin) }}</p>
              </div>
            </Tag>
            <div v-if="topicIndex > 0 && isTopicFirstSegment" class="flex flex-col grow  justify-between text-ellipsis  line-clamp-2  ">
              <div class="flex items-center  justify-start h-full " >
                <div v-if="editTitle">
                  <InputText v-model="editedTitle" @focusout="editTitle = false" />
                </div>
                <div v-else-if="topicIndex > 0 && isTopicFirstSegment" class="flex gap-2 h-full items-center shrink text-ellipsis  line-clamp-2   ">
                  <div :class="`h-full pl-3 text-ellipsis  line-clamp-2 flex `"
                    v-tooltip.bottom="{ value: title, showDelay: 400, class: 'single-line-tooltip' }">

                      <p  class="text-ellipsis font-bold line-clamp-2"> {{title }} </p>

                  </div>
                  <Button class="min-w-[33px] " icon="pi pi-pencil" severity="contrast" text @click="editTitle = true" />
                </div>
                <AtomPluginBlock :topicIndex="topicIndex" :isTopicFirstSegment="isTopicFirstSegment"
                  :chipList="chipList" />
                <Button class="min-w-[33px] " icon="pi pi-ellipsis-h" severity="contrast" text @click="dialogVisible = true" />
                </div>
                <AtomPluginAutocompleteList  :phrase="phrase" :title="title" :topicIndex="topicIndex" :isTopicFirstSegment="isTopicFirstSegment" :dialog-visible="dialogVisible" @toggle-dialog="dialogVisible = false"/>
            </div>
            <div v-else="topicIndex == 0 && isTopicFirstSegment" class="h-8">
              <div
                :class="`h-8 p-3  w-fit flex items-center mb-3 text-${textColorPicker(computeColor(topicIndex).hex)} `">
                <b>Ignoré</b>
              </div>
            </div>
            <AtomPluginAutocompleteList  :phrase="phrase" :title="title" :topicIndex="topicIndex" :isTopicFirstSegment="isTopicFirstSegment" :dialog-visible="dialogVisible" @toggle-dialog="dialogVisible = false"/>
            <Button v-if="topicIndex != 0" severity="contrast" icon="pi pi-ban" text @click="emit('deactivateTopic', { index: index })" />
            <Button v-else severity="contrast" icon="pi pi-check" text @click="emit('activateTopic', { index: index })" />
          </div>
              <div v-if=" chipList.length > 0 " class="px-2 py-1 border-dashed border border-black inline-flex flex-wrap gap-2  ">
                <Chip  v-for="(chip, index) in chipList" :key="chip.label" :label="chip.label" removable
                  v-on:remove="handleRemove(index)" />
              </div>
          </div>
        </div>
      </div>
    </div>
    <OverlayBadge v-if="phrase.data.comments?.length > 0" :value="phrase.data.comments?.length"
                  :class="`overflow-visible !absolute    z-[60] !transition !duration-500 ${isTopicFirstSegment? 'top-[53px]' : 'top-[3px]'} right-[4px]`">
      <Button class="!bg-primary !border-primary"  @click="toggleComment">
        <img style="height:14px;width:14px;" :src="commentIcon" alt="comment icon" />
      </Button>
    </OverlayBadge>
    <Button v-else
      :class="` !absolute opacity-0 hover:!bg-primary hover:!border-primary  group-hover:opacity-30 hover:!opacity-100 z-[60] !transition !duration-500 ${isTopicFirstSegment? 'top-[53px]' : 'top-[3px]' } right-[4px]`"
      @click="toggleComment" >
      <img style="height:14px;width:14px;" :src="commentIcon" alt="comment icon" />
    </Button>
    <div
      :class="`bg-white relative p-3 ${isTopicFirstSegment? 'mt-[10px]' : ' '} z-40 isolate  text-sm col-auto customText grow rounded-md cursor-pointer transition-all relative hover:shadow-lg `"
      @click="$emit('onSegmentClick', { tcin: phrase.tcin, tcout: phrase.tcout, index: index })">
      {{ $props.phrase.data?.text[0] }}
      <div v-if="options.timecode_segment"
        class="absolute flex items-center h-full top-[0] left-[-90px] z-50 text-xs overflow-visible    ">
        <p class="border-dashed border border-title py-1 px-2 rounded-sm ">{{ timestampToUnix(phrase.tcin)}}</p>
      </div>
    </div>
    <div class="relative gap-0  w-[calc(100%+20px)] z-40 ">
      <div
        :class="`absolute z-50 w-full ${ !isTopicsLastSegment ? 'top-[-10px]' : '' }  left-[-10px] h-6 over pointer-events-auto cursor-pointer`"
        @click="handleSegmentation">
        <div ref="ruptureTemplate"
          :class="` justify-center rupture w-full border-t-2 border-dashed text-white relative  h-0 hidden  ${isTopicsLastSegment && topicIndex != undefined ? 'border-t-primary' : ' border-t-error'}  translate-y-[10px] group-hover:flex items-center   transition`">
          <i v-if="!isTopicsLastSegment || topicIndex == undefined"
            class="pi pi-hashtag  translate-y-[-1px] bg-error p-[5px] rounded  hover:bg-red-600 " />
          <div v-else class="flex justify-around w-[80px]">
            <div style="height:24px;width:24px;" v-tooltip.left="{ value: 'Déplacer une rupture', showDelay: 400 }"
              :draggable="isTopicsLastSegment && topics[topicIndex]!=null"
              class=" bg-primary  cursor-ns-resize rounded hover:bg-[#0C7DA2] flex items-center justify-center">
              <img  style="height:16px;width:16px;" class="pointer-events-none"
                src="../../public/icons/icons-svg/icons-svg/move-icon.svg"
                alt="move icon" />
            </div>
            <div style="height:24px;width:24px; " v-tooltip.right="{ value: 'Supprimer une rupture', showDelay: 400 }"
              class=" bg-red-500  cursor-pointer rounded hover:bg-red-600 flex items-center justify-center">
              <img style="height:16px;width:16px;" src="../../public/icons/icons-svg/icons-svg/trash-icon.svg"
                alt="delete icon" />
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

<script setup lang="ts">
import commentIcon from '../../public/icons/icons-svg/icons-svg/comment-icon.svg';

import { useService } from '#imports';
import { defineExpose } from 'vue';
import AtomPluginBlock from './AtomPluginBlock.vue';
import { useAuth } from '#imports';
import AtomComment from './AtomComment.vue';
import { remove } from 'lodash'
import AtomPluginAutocompleteList from "~/components/atoms/AtomPluginAutocompleteList.vue";

const { phrase, colors, topics, index, topicList, segmentationRefs} = defineProps(['phrase', 'colors', 'topics', 'index', 'topicList', 'segmentationRefs'])
const emit = defineEmits(['segmentation', 'onSegmentClick','activateTopic', 'deactivateTopic','dragging-start','dragging-end'])
const { $application } = useService()
const { userEmail } = useAuth()
const { options } = useOptions()
const { timestampToUnix, computeColor, textColorPicker, unixToTimestamp } = $application
const segment = ref(null)
const toast = useToast()
const topicIndex = computed(() => topics[index])
const iconBool = ref('pi pi-tag')
const topicText = ref(null)
const titleContainer = ref(null)
const editTitle = ref(false)
iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
const editedTitle = ref(null)
const ruptureTemplate = ref()
const comment = ref(null)
const dialogVisible = ref(false);
const title = computed(()=>{
  if(isTopicFirstSegment.value){
    return editedTitle.value ? editedTitle.value : 'Topic '+ topicIndex.value
  }
  else return null
})

const chipList = ref(topicList[topicIndex.value]?.labels || []);
const topicHeader = ref<HTMLDivElement>()
const firstSegmentPadding = ref<HTMLDivElement>()

    function handleRemove(index){
      remove(topicList[topicIndex.value]?.labels ,(el)=>chipList.value[index] == el)
    }

onMounted(()=>{
watch(()=>chipList.value.length,async (value)=>{
    await nextTick()
  if(isTopicFirstSegment.value && firstSegmentPadding.value){
      firstSegmentPadding.value.style.paddingBottom = topicHeader.value?.getBoundingClientRect().height-20  +'px'
  }
})
})
function truncateText(text) {
    if (!text) return "";

    if (text.length <= 20) return text;
    let firstPart = text.slice(0, 20);
    let secondPart = text.slice(20, 40);

    return text.length > 40 ? `${firstPart}\n${secondPart}...` : `${firstPart}\n${secondPart}`;
}
function startDrag(event: DragEvent) {
  event.stopPropagation()
  const target: HTMLDivElement = event.target as HTMLDivElement
  target.style.opacity = '0.4'
}

function getLiList(element,count) {
  if (element.children.item(1)?.tagName== 'OL') return {list: element.children, deep: count}
  return getLiList(element.parentElement,count+1)
}

function getDeepElement(element,deep){
  if(deep==0) return element
  return getDeepElement(element.parentElement, deep-1)
}

function handleDrop(event: DragEvent) {
  document.querySelector('.customHover')?.classList.remove('customHover')
  event.preventDefault()
  event.stopPropagation()
  const target: HTMLDivElement = event.target as HTMLDivElement
  const result = getLiList(target,0)
  const listLiElement : HTMLCollection = result.list
  const index = Array.from(listLiElement).filter((el)=>el.type!='button').indexOf(getDeepElement(target,result.deep-1))
  if( index != -1) emit('dragging-end',{index: index})
  const hoverList: NodeList = document.querySelectorAll('.customHover')
  hoverList.forEach((el)=>{
    el.classList?.remove('customHover')
  } )
}

function toggleComment(event) {
    comment.value.toggle(event)
}


function endDrag(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  const target: HTMLDivElement = event.target as HTMLDivElement
  target.style.opacity = '1'
  const result = getLiList(target,0)
  const listLiElement : HTMLCollection = result.list
  const index = Array.from(listLiElement).filter((el)=>el.type!='button').indexOf(getDeepElement(target,result.deep-1))
  emit('dragging-start',{index: index})
}



function previewDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  let target: HTMLDivElement = event.target as HTMLDivElement
  let mainDiv: HTMLDivElement = target.parentElement
  if (!target.classList.contains('customHover')) {
    target.classList.add('customHover')
    target?.nextElementSibling?.classList.add('customHover')
  }
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  let target: HTMLDivElement = event.target as HTMLDivElement
  let mainDiv: HTMLDivElement = target.parentElement
  if (target.classList.contains('customHover')) {
    target.classList.remove('customHover')
    target?.nextElementSibling?.classList.remove('customHover')

  }
}


function computeDrag(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
}

const isTopicFirstSegment = computed(() => {
  if (topics[index] != undefined) {
    return topics[index] != topics[index - 1]
  }
  else return false
})

const computeTopicHeight = async () => {
  if (isTopicFirstSegment.value) {
    await nextTick()
    let id = index
    let topicHeight = 0
    do {
      topicHeight += segmentationRefs[id].clientHeight
      id++
    } while (topics[id] == topics[id - 1]);
    titleContainer.value.style.height = topicHeight + 'px'
  }
}


onMounted( ()=>{
  watchEffect(()=>{
  })
  watch(()=>editTitle.value,(newValue, oldValue)=>{
    if(isTopicFirstSegment.value && newValue == false ){
      topicList[topicIndex.value].title = editedTitle.value
    }
  })
  watch(()=>isTopicFirstSegment.value,(newValue)=>{
    if(newValue == true){
      editedTitle.value =  topicList[topicIndex.value]?.title
    }
  })
  watch(()=>isTopicFirstSegment.value,()=>{
      computeTopicHeight()
  })
  watch(()=>topicList[topicIndex.value]?.title,(newTitle)=>{
    if(isTopicFirstSegment.value ){
      editedTitle.value = newTitle
    }
  },{immediate: true})


  window.addEventListener('resize', computeTopicHeight,{})

})


const isTopicsLastSegment = computed(() => {
  if (topics[index + 1] == undefined) return true
  return topics[index] != topics[index + 1]
})

function applyHeaderColor(hex) {
  if(topicIndex.value == 0)return 'background-color: #BEBEBE4c;'
      const [r, g, b] = extractRGB(hex);
      return `background-color: rgba(${r},${g},${b}, 0.25);`;
}

function dynamicStyle(color) {

  const hexMatch = color?.match(/^#?(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/);

  // const hexMatch = color?.match(/^#([0-9A-F]{3}|[0-9A-F]{6})$/);
  if (topics[index] == topics[index - 1] && topics.length !== 0 && topics[index] != undefined) {
    if (hexMatch) {
      const [r, g, b] = extractRGB(color);
      if (index < 2) {
      }
      return `background-color: rgba(${r},${g},${b}, 0.25); margin-top: 0px;  `;
    }
    else {
      return `background-color: ${reduceOpacityOfColor(color, 0.25)}; margin-top: 0px;   `;
    }
  } else {
    if (hexMatch) {
      const [r, g, b] = extractRGB(color);
      return `background-color: rgba(${r},${g},${b}, 0.25);`;
    }
    return {
      margintop: '1.25rem',
      backgroundColor: reduceOpacityOfColor(color, 0.25),
    };
  }
}
function reduceOpacityOfColor(rgbaColor, opacity) {
  const rgbaMatch = rgbaColor?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    let a = parseFloat(rgbaMatch[4]);
    a = Math.max(a - opacity, 0); // Réduire l'opacité sans descendre en dessous de 0
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return rgbaColor;
}
function extractRGB(hexColor) {
  const rgbaColor = hexToRgba(hexColor, 0.5);
  const rgba = rgbaColor?.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  return rgba.slice(0, 3);
}
function hexToRgba(hex, opacity) {
  let r = 0, g = 0, b = 0;
  // Handle 3 digit hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // Handle 6 digit hex
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
const handleSegmentation = () => {
  emit('segmentation', { index: index })
  iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
  topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
}


defineExpose({  id: topicIndex, })

provide('chipList', chipList);
</script>

<style scoped lang="postcss">

.selected-segment > div {
  @apply border-surface-500 border-2 ;
}

</style>

<style lang="postcss">

.customHover .rupture,
.customHover + .rupture {
  @apply flex
}

.customHover{
}

.customHover + div {
  @extend .customHover
}


img { /* svg on an img tag */
  -webkit-filter: invert(.75); /* safari 6.0 - 9.0 */
          filter: invert(1);
}


.over:hover .rupture {
  @apply flex
}
.single-line-tooltip {
  white-space: nowrap !important;
  max-width: none !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
