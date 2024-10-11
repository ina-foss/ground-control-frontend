<template>
  <div  ref="span" :class="'inline border-blue-400 '+(options.span==true ? ' highlighted-text cursor-pointer' : '') +  (linkCss != '' ? linkCss + ' cursor-crosshair' : '')" @click="handleClick" @mousedown="handleDrag" >
    <!-- <span class="inline border-blue-400 cursor-ew-resize  hover:border-l-2"></span> -->
    <div class="inline ">
      {{ (newText == '') ? text : newText }}
    </div>
    <span v-if="options.span == true">
      <span v-for="lbl in newLabel" class=" align-super text-[0.70rem] pl-[0.5rem] ">{{lbl}}</span>
    </span>
    <!-- <span class="inline border-blue-400 cursor-ew-resize  hover:border-r-2"></span> -->
  </div>
</template>


<script setup>
const {label, text, color, index: index, linkCss, options} = defineProps({
  label: {
    type: Array,
    default: ()=>[]
  },
  text: {
    type: String,
    default: ()=>''
  },
  color: {
    type: String,
    default: ()=>''
  },
  index: {
    type: Number,
    default: ()=>null
  },
  linkCss: {
    type: String,
    default: ()=>''
  },
  options: {
    type: Array
  }
})

const emit = defineEmits(['spanReady','editSpan','focusSpan'])
const span= ref()
const newText = ref(text)
const newIndex = $ref(index)
const newLabel = $ref(label)
const focus = ref(false)
const { $application } = useService()

watchEffect(()=>
  console.log(options.span)
)

const handleClick = () => {
  emit('focusSpan', {index: newIndex })
  // emit('deleteSpan',{element: span.value, text: newText.value})
}
const handleDrag = () =>{
  emit('editSpan', {index: newIndex })
}
onMounted(()=>{
  watchEffect(()=>{

    if(span.value){
      emit('spanReady', {element: span.value, index: newIndex})
    }
  })
  watchEffect(()=>{
    if( focus.value == false){
      //TODO : Refactor tout dans $application et retourner le bon ordre + si c'est noir ou blanc ?
      let color ='--extra-'+ (newIndex%10+1)
      // span.value.style.backgroundColor = color + " 0.4)"
      span.value.style.backgroundColor = `var(${color})`
      let hex = getComputedStyle(document.body).getPropertyValue(color)
      span.value.style.color = colorIsDarkSimple(hex) ? 'white' : 'black'
    }
    else{
      span.value.style.backgroundColor = color + " 1)"
    }
  })
})

function colorIsDarkSimple(bgColor) {
  let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16); // hexToR
  let g = parseInt(color.substring(2, 4), 16); // hexToG
  let b = parseInt(color.substring(4, 6), 16); // hexToB
  return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 120;
}
const addLeftText = (editText) => {
  newText.value = editText + newText.value
}
const addRightText = (editText) => {
  newText.value =  newText.value + editText
}

defineExpose({addLeft: addLeftText, addRight: addRightText, focus: focus, text: newText, label:$$(newLabel), color: color, index:$$(newIndex)})

</script>

<style >
.highlighted-text {
  display: inline;
  position: relative;
}

.highlighted-text::after {
  content: '';
  position: absolute;
  top: -2px;
  bottom: -2px;
  right: 2px;
  cursor: ew-resize;
  width: 8px;
}

.highlighted-text::before {
  content: '';
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: -2px;
  cursor: ew-resize;
  width: 8px;
}
</style>
