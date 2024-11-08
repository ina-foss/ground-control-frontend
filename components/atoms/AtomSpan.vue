<template>
  <div  ref="span" :class="`inline border-blue-400 ${focus == true ? 'focus' : ''} ${options.span==true ? ` highlighted-text cursor-pointer ${computeColor(newIndex).full} ` : 'text-black '}  ${linkCss != '' ? linkCss + ' cursor-crosshair' : ''} `" @click="handleClick" @mousedown="handleDrag" >
    <div class="inline ">
      {{ (newText == '') ? text : newText }}
    </div>
    <span v-if="options.span == true">
      <span v-for="lbl in newLabel" class=" align-super text-[0.70rem] pl-[0.5rem] ">{{lbl}}</span>
    </span>
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
    type: Object
  }
})

const emit = defineEmits(['spanReady','editSpan','focusSpan'])
const span= ref()
const newText = ref(text)
const newIndex = $ref(index)
const newLabel = $ref(label)
const focus = ref(false)
const { $application } = useService()
const { textColorPicker, computeColor } = $application


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
    if( options.span == true ) {
        span.value.style.color = textColorPicker(computeColor(newIndex).hex)
    }
    else{
      span.value.style.color = 'black'
    }
  })
})

const addLeftText = (editText) => {
  newText.value = editText + newText.value
}
const addRightText = (editText) => {
  newText.value =  newText.value + editText
}

defineExpose({addLeft: addLeftText, addRight: addRightText, focus: focus, text: newText, label:$$(newLabel), color: color, index:$$(newIndex)})

</script>

<style >

.focus {
  @apply border-2 border-gray-500
}

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
