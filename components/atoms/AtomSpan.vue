<template>
  <div ref="span" class="inline hover:border-blue-400 hover:border-1 hover:scale(1.005) cursor-pointer highlighted-text">
    {{ text }}
  </div>
</template>


<script setup>
import { Fragment } from 'vue/jsx-runtime';

const {label, text, color } = defineProps(['label','text','color'])
const span= ref()
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
