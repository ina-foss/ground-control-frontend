<template>
  <div class="w-[300px] border-gray-100 rounded-lg border shadow-lg p-4 bg-white  flex flex-col">
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
          <div :class="` bg-[color:${computeColor(focusSpan).color}] text-${textColorPicker(computeColor(focusSpan).hex)}  rounded-xl min-w-6 text-center transition-all duration-500`" >
            {{ focusSpan+1}}
          </div>
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
        <div  v-for="(span,index) in spanRefArray" :key="index" class="flex flex-row hover:bg-surface-200 w-full py-2 justify-start gap-2 cursor-pointer" @click="emit('focusSpan',{index: index})" >
            <div  :class="` bg-[color:${computeColor(index).color}] text-${textColorPicker(computeColor(index).hex)} shrink rounded-xl min-w-6 text-center `" >{{ index +1 }}</div>
              <p class="truncate"> {{span.text}} </p>
            </div>
        </div>
    </div>
    <div>
      <Divider align="left" :pt="customdividerstyle" >
        <b>Relations ({{relationArray.length}})</b>
      </Divider>
      <div v-if="relationArray.length == 0">No Regions created yet</div>
      <div v-else class="border-gray-200 border-[1px] text-nowrap flex flex-col">
        <div v-for="(relation,index) in relationArray" :key="index" class="flex  justify-center items-center gap-3">
          <div  :class="` bg-[color:${computeColor(relation.from).color}] text-${textColorPicker(computeColor(relation.from).hex)} shrink rounded-xl min-w-6 text-center`" >{{ relation.from +1 }}</div>
          <i class="pi pi-arrow-right"/>
            <div  :class="` bg-[color:${computeColor(relation.to).color}] text-${textColorPicker(computeColor(relation.to).hex)} shrink rounded-xl min-w-6 text-center `" >{{ relation.to +1 }}</div>
            <Button icon="pi pi-trash" outlined  size="large" severity="danger" class="scale-[0.6]"/>
        </div>
      </div>
    </div>


  </div>
</template>


<script setup>
import { useService } from '#imports';
const { $application } = useService()
const customdividerstyle = ref({content: 'bg-surface-100 z-10 px-1'})
const emit = defineEmits(['deleteSpan','unselect','link','focusSpan'])
const { computeColor,textColorPicker } = $application


const { focusSpan, spanRefArray, relationArray } = defineProps(['focusSpan', 'spanRefArray','relationArray'])



</script>

