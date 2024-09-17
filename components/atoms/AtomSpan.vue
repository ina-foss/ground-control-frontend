<template>
  <div  ref="span" :class="'inline border-blue-400 highlighted-text cursor-pointer'+ (linkCss != '' ? linkCss + ' cursor-crosshair' : '')" @click="handleClick" @mousedown="handleDrag" >
    <!-- <span class="inline border-blue-400 cursor-ew-resize  hover:border-l-2"></span> -->
    <div    class="inline ">
      {{ (newText == '') ? text : newText }}
    </div>
    <span class=" align-super text-[0.70rem] pl-[0.5rem] ">{{newLabel}}</span>
    <!-- <span class="inline border-blue-400 cursor-ew-resize  hover:border-r-2"></span> -->
  </div>
</template>


<script setup>

const {label, text, color, index: index, linkCss } = defineProps(['label','text','color','index','linkCss'])
const emit = defineEmits(['spanReady','editSpan','focusSpan'])
const span= ref()
const newText = ref(text)
const newIndex = $ref(index)
const newLabel = $ref(label)
const focus = ref(false)


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
      span.value.style.backgroundColor = color + " 0.4)"
    }
    else{
      span.value.style.backgroundColor = color + " 1)"
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
.highlighted-text {
  display: inline;
  position: relative;
}

.highlighted-text::after {
  content: '';
  position: absolute;
  top: -2px;
  bottom: -2px;
  rigth: 2px;
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
