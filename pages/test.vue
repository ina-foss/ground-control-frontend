<template>
  <div :class="'flex flex-row justify-around h-screen items-center w-full' + linkCursor" >
    <div class="flex flex-col p-6 max-w-[70%] gap-3 justify-center items-center h-screen">
      <SelectButton v-model="labelSelected" :unstyled="true" :options="labels" aria-labelledby="basic" />
      <div id="text" :class="linkCursor" @mouseup="handleSelection">{{text}}</div>
      <!-- <InputText v-model="state.range" class="border-black border-3"/> -->
      <Button label="Clear all" @click="deleteSelection" />


    </div>
  <div class="max-w-[400px]">
    <AtomSpanDetail :relation-array="relationArray" :focus-span="currentFocus" :span-ref-array="spanRefArray" @link="linkMode = !linkMode" @delete-span="onDeleteSpan($event)" @unselect="handleUnselect()" />
  </div>
    <div v-if="lastFocus">
      {{ lastFocus.value }}
    </div>

  </div>

</template>

<script setup lang="ts">
import _, { random } from 'lodash';
import BadgeDirective from 'primevue/badgedirective';
import {createApp} from 'vue'
import AtomSpan from '~/components/atoms/AtomSpan.vue';
import AtomSpanDetail from '~/components/atoms/AtomSpanDetail.vue';

const spanService = useSpanService()
provide('spanService',spanService)
const {handleSelection,spanRefArray, createSpan, onDeleteSpan, spanClicked, linkMode, currentFocus,labelSelected,loadSpan} = spanService
const elementArray = ref([])
const linkCursor = computed(()=> linkMode.value ? ' cursor-crosshair ' : '')
const spanCount = ref(spanRefArray.value.length)
const relationArray = ref([])
const labels = ['Person','Citation','Verbe']
const text = ref('Mercredi soir, le chef d’Etat a évacué l’idée d’adouber Lucie Castets, candidate officielle de la coalition de gauche : "Le sujet n’est pas un nom donné par une formation politique. La question est quelle majorité peut se dégager à l’Assemblée pour que le gouvernement de la France puisse passer des réformes."')
const state = reactive({
  selection: null as Selection | null,
  range: null as Range | null
})



const selectionText = computed(() => {
  if (state.range != null) {
    return state.range.toString()
  }
  return ''
})

watch(()=>currentFocus.value,(newFocus:any, oldFocus:any)=>{
  // if( typeof lastFocus == 'number' && spanRefArray.value[oldFocus]) spanRefArray.value[oldFocus].focus = false
  if( typeof currentFocus.value == 'number') spanRefArray.value[newFocus].focus = true

},{immediate:true})

function generatePastelColor(tagNumber : number) {
  // Use tag number to create a seed (this is a basic example, there are better ways to do this)
  const seed = tagNumber * 123456789;
  const random = s => ((seed * s) % 155) + 100;  // Between 100 and 255

  const r = random(3);
  const g = random(5);
  const b = random(7);

  return `rgb(${r}, ${g}, ${b}, `;
}

watch(()=>labelSelected.value,(newLabel:any)=>{
  if(typeof currentFocus.value != 'undefined'){
      spanRefArray.value[currentFocus].label = newLabel
  }
},{immediate: true})

const handleUnselect = () => {
  spanRefArray.value[currentFocus.value].focus = false
  currentFocus.value=undefined
}


const deleteSelection = () => {
  if (state.selection) {
    const span = document.createElement('sup')
    span.style.backgroundColor = "red"
    span.appendChild(selectionText.value)
    state.range.insertNode(span)
  }

}


</script>

