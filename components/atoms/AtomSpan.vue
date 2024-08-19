<template>
  <div class="inline">
    <!-- <span class="inline border-blue-400 cursor-ew-resize  hover:border-l-2"></span> -->
    <div ref="span" @click="handleClick" @mousedown="handleDrag" class="inline border-blue-400 highlighted-text cursor-pointer hover:border-2 ">
      {{ (newText == '') ? text : newText }}
    </div>
    <!-- <span class="inline border-blue-400 cursor-ew-resize  hover:border-r-2"></span> -->
  </div>
</template>


<script setup>
import { Fragment } from 'vue/jsx-runtime';
import { createApp } from 'vue';

const {label, text, color } = defineProps(['label','text','color'])
const emit = defineEmits(['deleteSpan','editSpan'])
const span= ref()
const newText = ref(text)

const handleClick = () => {
  emit('deleteSpan',{element: span.value, text: newText.value})
}
const handleDrag = () =>{
  emit('editSpan', ({addLeft: addLeftText}))
}
onMounted(()=>{

  span.value.setAttribute('label',label)
  span.value.style.backgroundColor = color
})

const addLeftText = (editText) => {
  newText.value = editText + newText.value
}
defineExpose({addLeft: addLeftText})

</script>

<style >
.highlighted-text {
  display: inline;
  position: relative;
}

.highlighted-text::after {
  display: inline;
  content: attr(label);
  vertical-align:super;
  padding-left: 0.5rem;
  font-size: 0.70rem;
}

.highlighted-text::before {
  content: '';
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: -2px;
  cursor: ew-resize;
  width: 2px;
}
</style>
