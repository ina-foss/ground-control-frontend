<template>
  <div class="w-[300px] border-gray-100 border shadow-lg p-3 bg-surface-100 flex flex-col">
    <div class="w-full">
      <b>Result</b>
      <Divider
:pt="{
        root:{
          style: 'margin-top : 10px; margin-bottom: 10px'
        }
      }" />
        <div v-if="typeof focusSpan == 'undefined'">Nothing selected</div>
        <div v-else class="border-gray-200  p-2 flex flex-col start-0  gap-2">
          <div class=" inline-flex items-start justify-start gap-2" >
          <div class="bg-[--color]  rounded-xl min-w-6 text-center transition-all duration-500" :style="`--color: ${spanRefArray[focusSpan].color}1) `">{{ focusSpan +1 }}</div>
            {{spanRefArray[focusSpan].text}}
          </div>
        <div>
          label(s):
          <span v-for="lbl in spanRefArray[focusSpan].label">
          {{ lbl }}
          </span>
        </div>
        <div class="flex flex-row gap-2">
          <Button outlined class="scale-[85%]" icon="pi pi-paperclip"  @click=" emit('link')"/>
          <Button outlined class="scale-[85%]" icon="pi pi-eject"  @click=" emit('unselect') " />
          <Button class="scale-[85%]" severity="danger"  icon="pi pi-trash" @click=" emit('deleteSpan',{index : focusSpan}) " />
        </div>
        </div>

    </div>
    <div>
      <Divider align="left" :pt="customdividerstyle" >
        <b>Regions ({{ spanRefArray.length}})</b>
      </Divider>

        <div v-if="spanRefArray.length == 0">No Regions created yet</div>
        <div v-else class="border-gray-200 border-[1px] p-2 text-nowrap flex flex-col start-0 ">
          <div  v-for="(span,index) in spanRefArray" :key="index" class="flex flex-row hover:bg-surface-100 w-full py-2 justify-start gap-2" >
            <div  class="bg-[--color] shrink rounded-xl min-w-6 text-center" :style="`--color: ${span.color}1) `">{{ index +1 }}</div>
              <p class="truncate"> {{span.text}} </p>
            </div>
        </div>
    </div>
    <div>
      <Divider align="left" :pt="customdividerstyle" >
        <b>Relations ({{relationArray.length}})</b>
      </Divider>
      <div v-if="relationArray.length == 0">No Regions created yet</div>
      <div v-else class="border-gray-200 border-[1px] p-2 text-nowrap flex flex-col">
        <div v-for="(relation,index) in relationArray" :key="index" class="flex  justify-center items-center gap-3">
            <div  class="bg-[--color] shrink rounded-xl min-w-6 text-center" :style="`--color: ${spanRefArray[relation.from].color}1) `">{{ relation.from +1 }}</div>
          <i class="pi pi-arrow-right"/>
            <div  class="bg-[--color] shrink rounded-xl min-w-6 text-center" :style="`--color: ${spanRefArray[relation.to].color}1) `">{{ relation.to +1 }}</div>
            <Button icon="pi pi-trash" outlined  size="large" severity="danger" class="scale-[0.7]"/>
        </div>
      </div>
    </div>


  </div>
</template>


<script setup>
const customdividerstyle = ref({content: 'bg-surface-100 z-10 px-1'})
const emit = defineEmits(['deleteSpan','unselect','link'])


const { focusSpan, spanRefArray, relationArray } = defineProps(['focusSpan', 'spanRefArray','relationArray'])


</script>

