<template>
  <div class="bg-gray-300 p-3 pl-3 rounded-lg" v-bind:style="dynamicStyle($props.colors[topicIndex])">
    <div class="flex items-center gap-2">
      <Button v-bind:icon="iconBool" v-bind:label="topicText" @click="handleSegmentation()"
              :pt="{
                root: {
                    style: `max-width: 40px; min-width: 40px; background-color:${$props.colors[topicIndex]}; border:none `
                }
            }"/>
      <div v-tooltip.top="phrase.tcin + '-' + phrase.tcout"
           class="bg-white p-3 leading-tight text-sm col-auto grow rounded-md cursor-pointer hover:scale-[1.01] transition-all hover:shadow-lg "
           @click="$emit('onSegmentClick',{tcin : phrase.tcin, tcout: phrase.tcout, index: props.index})">
        {{ $props.phrase.data.text[0] }}
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps(['phrase', 'colors', 'topics', 'index'])
const emit = defineEmits(['segmentation','onSegmentClick'])

const toast = useToast()

// let bgButtonColor = ref('transparent')
let topicIndex = ref(0)
if (props.phrase.data.topic != undefined) topicIndex.value = props.phrase.data.topic
var iconBool = ref('pi pi-tag')

var topicText = ref(null)

iconBool.value = topicIndex.value == 0 ? 'pi pi-bookmark' : ''
topicText.value = topicIndex.value == 0 ? null : "#" + topicIndex.value

let isVisible = false

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
  const hexMatch = color.match(/^#([0-9A-F]{3}|[0-9A-F]{6})$/);
    if (props.topics[props.index] === props.topics[props.index - 1] && props.topics.length !== 0 && props.topics[props.index]) {
      isVisible = true
      if(hexMatch){
        const [r, g, b] = extractRGB(color);
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
          marginTop: '-20px'
        };
      }
      return {
        backgroundColor: reduceOpacityOfColor(color, 0.5),
        marginTop: '-20px'
      };
    } else {
      isVisible = false
      if(hexMatch){
        const [r, g, b] = extractRGB(color);
        return {
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
        };
      }
      return {
        backgroundColor: reduceOpacityOfColor(color, 0.5),
      };
    }
}


 function reduceOpacityOfColor(rgbaColor, opacity) {
  const rgbaMatch = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
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
  const rgba = rgbaColor.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
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


  if (props.index == 0) { // Cas particulier de la premiere phrase
    if (topicIndex.value == 0) {
      var randomColor = generatePastelColor(props.index + 1)
      props.colors.push(randomColor)
      // emit('segmentation','premier topic')
      props.topics[props.index] = 1
      topicIndex.value = 1
    } else {
      !props.topics.includes(props.index) && props.colors.pop()
      props.topics[props.index] = 0;
      topicIndex.value = 0
    }
  } else if (topicIndex.value < props.topics[props.index - 1]) { //On rattrape le topic precedent
    if (props.topics[props.index - 1] != undefined) {
      props.topics[props.index] = props.topics[props.index - 1]
      topicIndex.value = props.topics[props.index]

    } else {
      toast.add({severity: "info", detail: "Can't modify this sentence"})
    }
    // emit('segmentation','meme topic')

  } else if (topicIndex.value == props.colors.length - 1 && (props.topics[props.index - 1] == topicIndex.value)) { // On cree un nouveau topic
    console.log('new topic')
    var randomColor = generatePastelColor(props.index + 1)
    props.colors.push(randomColor)
    props.topics[props.index]++
    topicIndex.value = props.topics[props.index]

  } else if (topicIndex.value < props.topics[props.index + 1]) { // On itere parmi les topics existants
    props.topics[props.index]++
    topicIndex.value++
  } else if (topicIndex.value != 0) { // Reset du topic a 0

    // let topicArray = props.topics
    // emit('segmentation', props.index)
    props.topics[props.index] = 0;
    !props.topics.includes(topicIndex.value) && props.colors.pop()
    topicIndex.value = 0
  }

  console.log('TOPCIS :')
  console.log(props.topics)
  console.log('index : ' + props.index)
  console.log('COLORS :')
  console.log(props.colors)

  emit('segmentation', props.index)

  iconBool.value = topicIndex.value == 0 ? 'pi pi-bookmark' : ''
  topicText.value = topicIndex.value == 0 ? null : "#" + topicIndex.value
}


</script>
<style scoped>
.lineDown {
  position: absolute;
  width: 2px;
  height: calc(16% - 29px);
  top: 131px;
  left: 36%;
  z-index: 0;
  background-color: red;
}

.lineUp {
  position: absolute;
  width: 2px;
  height: calc(19% - 29px);
  top: 169px;
  left: 36%;
  z-index: 0;
}
</style>