<template>
  <div v-if="!searchInterface">
    <Button severity="contrast" icon="pi pi-search" label="Recherche" @click="invertInterface" />
  </div>
  <div v-else class="flex w-[200px]  ">
    <p>{{ selectedSpan.value }}</p>
    <div class="w-[75%]">
    <Select v-model="selectedSearch" :options="labels" editable show-clear class="" />
    </div>
    <div class="grow flex flex-nowrap">
      <Button icon="pi pi-arrow-left" @click="downIndex()" size="small" outlined severity="contrast" />
      <Button icon="pi pi-arrow-right" @click="upIndex()" size="small" outlined severity="contrast" />
    </div>
  </div>

</template>

<script setup>

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
     setTimeout(()=>array[searchIndex].scrollIntoView({behavior: 'smooth'}),100)

  }
})

watch(()=>searchIndex,(index)=>{
  if( selectedSpan.value.length > 0 ){
    console.log(index)
     setTimeout(()=> selectedSpan.value[index].scrollIntoView({behavior: 'smooth'}),100)

  }
})

watch(()=>selectedSearch.value,(value)=> {
  if( value &&  value != ''){
    selectedSpan.value = []
    spans.forEach(span => {
     let spanDom = document.querySelector(`[tcin="${span.tcin}"]`)
      if(spanDom.innerText.includes(selectedSearch.value)){
          selectedSpan.value.push(spanDom)
      }
    });

  }
})

const invertInterface = () => {
  searchInterface = !searchInterface
}
</script>
