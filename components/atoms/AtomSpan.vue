<template>
  <div  ref="span" :class="`inline border-blue-400 ${focus == true ? 'focus' : ''} ${options.span==true ? ` highlighted-text cursor-pointer ${computeColor(newIndex).full} ` : 'text-black '}  ${linkCss != '' ? linkCss + ' cursor-crosshair' : ''} `" @click="handleClick" @mousedown="handleDrag" >
    <div ref="spanText" class="inline ">
      <slot/>
    </div>
    <span v-if="options.span == true">
      <span v-for="lbl in newLabel" class=" align-super text-[0.70rem] pl-[0.5rem] ">{{lbl}} </span>
    </span>
  </div>
</template>


<script setup>

const {label, tcIn, tcOut, color, index: index, linkCss, options} = defineProps({
  label: {
    type: Array,
    default: ()=>[]
  },
  tcIn:{
    type: String,
  },
  tcOut:{
    type: String,
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
const spanText = ref()
const newText = ref('')
const newIndex = $ref(index)
const newLabel = $ref(label)
let newTcin = $ref(tcIn)
let newTcout = $ref(tcOut)
const focus = ref(false)
const { $application } = useService()
const { textColorPicker, computeColor } = $application


const handleClick = () => {
  emit('focusSpan', {index: newIndex })
}
const handleDrag = () =>{
  emit('editSpan', {index: newIndex })
}
onMounted(async()=>{
    await nextTick()
    const list = span.value?.firstElementChild?.children
    for (let item of list) {
      newText.value += (item.innerText + ' ')
    }
watchEffect(async ()=>{
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

const addLeftText = (node) => {
  newTcin = node.firstElementChild?.getAttribute('tcin')
  span.value.firstElementChild.insertBefore(node,span.value.firstElementChild.firstChild)
}
const addRightText = (node) => {
  newTcout = node.lastElementChild?.getAttribute('tcout')
  span.value.firstElementChild.appendChild(node)
}

defineExpose({addLeft: addLeftText, addRight: addRightText, focus: focus, text: newText,tcin: $$(newTcin), tcout: $$(newTcout), label:$$(newLabel), color: color, index:$$(newIndex)})

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
