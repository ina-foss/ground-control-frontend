<template>
  <div ref="span" @click="handleClick" class="inline border-blue-400 hover:border-2   cursor-pointer highlighted-text">
    {{ text }}
  </div>
</template>


<script setup>
import { Fragment } from 'vue/jsx-runtime';

const {label, text, color } = defineProps(['label','text','color'])
const emit = defineEmits(['deleteSpan'])
const span= ref()

const handleClick = () => {
  emit('deleteSpan',{element: span.value, text: text})
}
onMounted(()=>{

  span.value.setAttribute('label',label)
  span.value.style.backgroundColor = color
})
console.log(label)

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
</style>
