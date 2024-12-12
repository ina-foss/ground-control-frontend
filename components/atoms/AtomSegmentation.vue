<template>
  <div :style="dynamicStyle(colors[topicIndex])" ref="segment" :tcin="phrase.tcin" :class="`bg-gray-300  transition-colors group relative mt-5 p-3 pl-3  flex flex-col ${topicIndex ==0 ? 'text-gray-400' : ''} ${isTopicFirstSegment || topicIndex== undefined ? 'rounded-t-lg': '' } ${isTopicsLastSegment ? 'rounded-b-lg': ''} `" >
      <div v-if="isTopicFirstSegment" :class="`flex  justify-center items-center sticky top-0 h-8 w-fit mb-3  p-3   `"  >
      </div>
    <div ref="titleContainer" class=" absolute flex self-center top-0 pt-3 z-40">
      <div v-if="editTitle"  >
        <InputText v-model="editedTitle" @focusout="editTitle = false"  />
      </div>
      <div v-else-if="topicIndex > 0 && isTopicFirstSegment" class="flex  sticky top-0 h-8    "  >
        <Button severity="contrast" icon="pi pi-ban" text @click="emit('deactivateTopic',{index: index})"/>
        <div :class="`h-8 p-3 ${computeColor(topicIndex).full} w-fit flex items-center mb-3 text-${textColorPicker(computeColor(topicIndex).hex)} `">
          <b>{{ title }}</b>
        </div>
        <Button icon="pi pi-pencil" severity="contrast" text @click="editTitle = true" />
      </div>
      <div v-else-if="topicIndex == 0 && isTopicFirstSegment" class="h-8">
        <div :class="`h-8 p-3  w-fit flex items-center mb-3 text-${textColorPicker(computeColor(topicIndex).hex)} `">
          <b>Ignoré</b>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div
        v-tooltip.top="{ value : timestampToUnix(phrase.tcin) + '-' + timestampToUnix(phrase.tcout),
        pt: {
          root:{
            style : 'max-width: fit-content '
          }
        }
        }"
        class="bg-white p-3 leading-tight text-sm col-auto grow rounded-md cursor-pointer  transition-all hover:shadow-lg "
        @click="$emit('onSegmentClick', { tcin: phrase.tcin, tcout: phrase.tcout, index: index })">
        {{ $props.phrase.data?.text[0] }}
      </div>
    </div>
    <div  :class="` w-full bg-clip-padd bg-grey-300 h-1   z-50 ${isTopicsLastSegment ? 'translate-y-[21px]' : 'translate-y-[12px]'} cursor-pointer group-hover:bg-title hover:scale-y-[200%]  transition`" @click="handleSegmentation">
      </div>
  </div>
</template>

<script setup>
import { useService } from '#imports';
import { defineExpose } from 'vue';
import AtomTopicList from './AtomTopicList.vue';

const { phrase, colors, topics, index,topicList , segmentationRefs } = defineProps(['phrase', 'colors', 'topics', 'index', 'topicList', 'segmentationRefs'])
const emit = defineEmits(['segmentation', 'onSegmentClick','deactivateTopic'])
const { $application } = useService()
const { timestampToUnix, computeColor, textColorPicker,unixToTimestamp } = $application
const segment = ref(null)
const toast = useToast()
const topicIndex = computed(()=> topics[index] )
const iconBool = ref('pi pi-tag')
const topicText = ref(null)
const titleContainer = ref(null)
iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
const editedTitle = ref(null)
const title = computed(()=>{
  if(isTopicFirstSegment.value){
    return editedTitle.value ? editedTitle.value : 'Topic '+ topicIndex.value
  }
  else return null
})

const editTitle = ref(false)



const isTopicFirstSegment = computed(()=> {
  if( topics[index]!= undefined){
    return topics[index] != topics[index-1]
  }
  else return false
})

const computeTopicHeight = async () => {
    if(isTopicFirstSegment.value){
      await nextTick()
      let id = index
      let topicHeight = 0
      do {
        topicHeight += segmentationRefs[id].clientHeight
        id++
      } while (topics[id] == topics[id-1]);
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
      editedTitle.value =  topicList[topicIndex.value].title
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


const isTopicsLastSegment = computed(()=>{
    if( topics[index+1] == undefined ) return true
    return topics[index] != topics[index+1]
})

function dynamicStyle(color) {

  const hexMatch = color?.match(/^#?(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/);

  // const hexMatch = color?.match(/^#([0-9A-F]{3}|[0-9A-F]{6})$/);
  if (topics[index] == topics[index - 1] && topics.length !== 0 && topics[index] != undefined) {
    if (hexMatch) {
      const [r, g, b] = extractRGB(color);
      if(index < 2 ) {
      }
      return `background-color: rgba(${r},${g},${b}, 0.25); margin-top: 0px;  `;
    }
    else{
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
  emit('segmentation',{index: index})
  iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
  topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
}

    defineExpose({title: title, id: topicIndex,  })

</script>
