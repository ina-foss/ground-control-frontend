<template>
  <div  ref="span" :tcin="tcIn" :tcout="tcOut" :class="`inline scroll-mt-16 items-center h-auto border-blue-400 ${focus == true ? 'focus' : ''} ${options.span==true ? ` highlighted-text cursor-pointer ${currentColor} ` : 'text-black '}  ${linkCss != '' ? linkCss + ' cursor-crosshair' : ''} `" @click="handleClick" @mousedown="handleDrag" >
    <div ref="spanText" class="inline ">
      <slot/>
    </div>
    <span v-if="options.span == true" class="pl-[0.5rem]">
      <span v-for="lbl in newLabel.map(String).join(' ')" class=" align-super text-[0.70rem]  ">{{lbl}} </span>
    </span>
  </div>
</template>


<script setup>

const {label, tcIn, tcOut, id , linkCss, labels} = defineProps({
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
  id: {
    type: Number,
    default: ()=>null
  },
  linkCss: {
    type: String,
    default: ()=>''
  },
  labels: {
    type: Object,
  }
})

const { options } = useOptions()
const emit = defineEmits(['spanReady','editSpan','focusSpan'])
const span= ref()
const spanText = ref()
const newText = ref('')
const newId = ref(id)
const newLabel = ref(label)
const newTcin = ref(tcIn)
const newTcout = ref(tcOut)
const focus = ref(false)
const { $application } = useService()
const { computeColorByLabel,textColorPicker, computeColor } = $application

const currentColor = computed(()=> computeColorByLabel(labels.value,newLabel.value).full)

const handleClick = () => {
  emit('focusSpan', {index: newId.value })
}
const handleDrag = () =>{
  emit('editSpan', {index: newId.value })
}

const updateText = () => {
    newText.value = ''
    const list = span.value?.firstElementChild?.children
    for (let item of list) {
      newText.value += (item.innerText + ' ')
    }
}

onMounted(async()=>{
    await nextTick()
    updateText()
watchEffect(async ()=>{
    if(span.value){
      emit('spanReady', {element: span.value, index: newId.value})
    }
  })
  watchEffect(()=>{
    if( options.span) {
      span.value.style.color = textColorPicker(computeColorByLabel(labels.value,newLabel.value).hex)
    }
    else{
      span.value.style.color = 'black';
        focus.value = false;
    }
  })
})

const addLeftText = (node) => {
  newTcin.value = node.firstElementChild?.getAttribute('tcin')
  span.value.firstElementChild.insertBefore(node,span.value.firstElementChild.firstChild)
    updateText()
}
const addRightText = (node) => {
  newTcout.value = node.lastElementChild?.getAttribute('tcout')
  span.value.firstElementChild.appendChild(node)
    updateText()
}

defineExpose({addLeft: addLeftText, addRight: addRightText, focus: focus, text: newText ,tcin: newTcin, tcout: newTcout, label: newLabel,id: newId})

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
  right: -4px;
  cursor: ew-resize;
  width: 8px;
}

.highlighted-text::before {
  content: '';
  position: absolute;
  top: -2px;
  bottom: -2px;
  left: -4px;
  cursor: ew-resize;
  width: 8px;
}
</style>
