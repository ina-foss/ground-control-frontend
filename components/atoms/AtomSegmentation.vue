<template>
  <div :style="dynamicStyle(newColors[topicIndex])" ref="segment" class="bg-gray-300 mt-5 p-3 pl-3 rounded-lg " >
    <div class="flex items-center gap-2">
      <Button :icon="iconBool" :label="topicText"
        :pt="{
        root: {
          style: `max-width:40px; min-width: 40px; height: 40px; background-color:${newColors[topicIndex]}; border:none;  `
        }
      }" @click="handleSegmentation()" />
      <div
        v-tooltip.top="{ value : timestampToUnix(phrase.tcin) + '-' + timestampToUnix(phrase.tcout),
        pt: {
          root:{
            style : 'max-width: fit-content '
          }
        }
        }"
        class="bg-white p-3 leading-tight text-sm col-auto grow rounded-md cursor-pointer hover:scale-[1.01] transition-all hover:shadow-lg "
        @click="$emit('onSegmentClick', { tcin: phrase.tcin, tcout: phrase.tcout, index: props.index })">
        {{ $props.phrase.data.text[0] }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useService } from '#imports';

const props = defineProps(['phrase', 'colors', 'topics', 'index'])
const emit = defineEmits(['segmentation', 'onSegmentClick'])
const { $application } = useService()
const { timestampToUnix, computeColor, textColorPicker } = $application
const segment = ref(null)
const newColors =props.colors;
const newTopics =props.topics;
const toast = useToast()
const topicIndex = computed(()=> props.topics[props.index] ? props.topics[props.index] : 0)
const iconBool = ref('pi pi-tag')
const topicText = ref(null)
iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value

function generatePastelColor(tagNumber) {
  // Use tag number to create a seed (this is a basic example, there are better ways to do this)
  const seed = tagNumber * 123456789;
  const random = s => ((seed * s) % 155) + 100;  // Between 100 and 255

  const r = random(3);
  const g = random(5);
  const b = random(7);

  return `rgb(${r}, ${g}, ${b}, 1)`;
}
function dynamicStyle(color) {

  const hexMatch = color?.match(/^#?(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/);

  // const hexMatch = color?.match(/^#([0-9A-F]{3}|[0-9A-F]{6})$/);
  if (props.topics[props.index] == props.topics[props.index - 1] && props.topics.length !== 0 && props.topics[props.index]) {
    if (hexMatch) {
      const [r, g, b] = extractRGB(color);
      if(props.index < 2 ) {
      }
      return `background-color: rgba(${r},${g},${b}, 0.5); margin-top: 0px; `;
    }
    else{
      return `background-color: ${reduceOpacityOfColor(color, 0.5)}; margin-top: 0px; `;
    }
  } else {
    if (hexMatch) {
      const [r, g, b] = extractRGB(color);
      return `background-color: rgba(${r},${g},${b}, 0.5); `;
    }
    return {
      margintop: '1.25rem',
      backgroundColor: reduceOpacityOfColor(color, 0.5),
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

  if (props.index === 0) { // Cas particulier de la premiere phrase
    if (topicIndex.value === 0) {
      const randomColor = computeColor(props.index).hex
      newColors[1] = (randomColor)
      newTopics[props.index] = 1
    } else {
      newTopics[props.index] = 0;
    }
  } else if (topicIndex.value < props.topics[props.index - 1]) { //On rattrape le topic precedent
    if (newTopics[props.index - 1] !== undefined) {
      newTopics[props.index] = props.topics[props.index - 1]

    } else {
      toast.add({ severity: "info", detail: "Can't modify this sentence" })
    }

  } else if (topicIndex.value === newColors.length - 1 && (props.topics[props.index - 1] === topicIndex.value)) { // On cree un nouveau topic
    //new topic
    const randomColor = computeColor(newColors.length-1).hex
    newColors.push(randomColor)
    newTopics[props.index]++

  } else if (topicIndex.value < newColors.length - 1  &&  topicIndex.value !=  props.topics[props.index+ 1] ) { // On itere parmi les topics existants
    newTopics[props.index]++
  } else if (topicIndex.value !== 0) { // Reset du topic a 0
    newTopics[props.index] = 0;
  }

  emit('segmentation', props.index)
  iconBool.value = topicIndex.value === 0 ? 'pi pi-bookmark' : ''
  topicText.value = topicIndex.value === 0 ? null : "#" + topicIndex.value
}


</script>
