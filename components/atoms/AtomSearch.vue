<template>
  <div v-if="!searchInterface" class="flex items-center">
    <Button severity="contrast" icon="pi pi-search" label="Recherche" @click="invertInterface" />
  </div>
  <div v-else class="flex w-[250px] items-center bg-surface-800 ">
    <Button severity="contrast" icon="pi pi-search" @click="invertInterface" />
    <div class="w-[75%]">
    <Select v-model="selectedSearch" :options="labels" editable show-clear class="" />
    </div>
    <Tag v-if="selectedSpan.length > 0" severity="contrast" >
      {{ searchIndex+1 }}/{{ selectedSpan.length }}
    </Tag>
    <div class="grow flex flex-nowrap">
      <Button icon="pi pi-arrow-left" size="small"  severity="contrast" @click="downIndex()" />
      <Button icon="pi pi-arrow-right" size="small" severity="contrast" @click="upIndex()" />
    </div>
  </div>

</template>

<script setup>

const emits = defineEmits([ 'find-span', 'unselect' ]);

const { spans } = defineProps({
    spans:{
      type: Array,
      default: ()=> []
    },
  labels:{
    type: Array,
    default: () => []
  }
})

let searchInterface = $ref(false)
const selectedSearch = ref()

const selectedSpan = ref([])

let searchIndex = $ref(0)

const upIndex = () =>{
  if (searchIndex+1 == selectedSpan.value.length) searchIndex = 0
  else searchIndex++
}

const downIndex = () =>{
  if (searchIndex-1 < 0 ) searchIndex =  selectedSpan.value.length-1
  else searchIndex--
}

watch(()=>selectedSpan.value,(array)=>{
  if( array.length > 0 ){
     setTimeout(()=>array[searchIndex]?.scrollIntoView({behavior: 'smooth'}),100)
    console.log(correspondingSpan(searchIndex).id)
    emits('find-span',{index: correspondingSpan(searchIndex).id})
  }
  else emits('unselect')
})

watch(()=>searchIndex,(index)=>{
  if( selectedSpan.value.length > 0 ){
     setTimeout(()=> selectedSpan.value[index]?.scrollIntoView({behavior: 'smooth'}),100)
    console.log(selectedSpan.value[index])
     emits('find-span',{index: correspondingSpan(index).id})
  }
})

watch(()=>selectedSearch.value,(value)=> {
  if( value &&  value != ''){
    selectedSpan.value = []
    spans.forEach(span => {
     const spanDom = document.querySelector(`[tcin="${span.tcin}"]`)
      if(spanDom.innerText.includes(selectedSearch.value)){
          selectedSpan.value.push(spanDom)
      }
    });

  }
  else selectedSpan.value = []
})

const correspondingSpan = (searchIndex) =>{
  const tcin = selectedSpan.value[searchIndex].getAttribute('tcin')
  const spanRef = _.find(spans, (span)=> span.tcin == tcin)
  return spanRef
}

const invertInterface = () => {
  searchInterface = !searchInterface
}
</script>
