<template>
  <div class="w-[300px] border-gray-100 border-[1px] shadow-lg p-3  flex flex-col">
    <div class="w-full">
      <b>Result</b>
      <Divider :pt="{
        root:{
          style: 'margin-top : 10px; margin-bottom: 10px'
        }
      }" />
        <div v-if="typeof focusSpan == 'undefined'">Nothing selected</div>
        <div v-else class="border-gray-200  p-2 flex flex-col start-0  gap-2">
          <div   class="" >
            <p class="  inline-flex items-start justify-start gap-2" >
            <div  class="bg-[--color]  rounded-xl min-w-6 text-center transition-all duration-500" :style="`--color: ${spanRefArray[focusSpan].color}1) `">{{ focusSpan +1 }}</div>
            {{spanRefArray[focusSpan].text}} </p>
          </div>
        <div>
          label(s): {{spanRefArray[focusSpan].label}}
        </div>
        <div class="flex flex-row gap-2">
          <Button outlined class="scale-[85%]" size="small" icon="pi pi-paperclip"/>
          <Button @click=" emit('unselect') " outlined class="scale-[85%]" size="small" icon="pi pi-eject" />
          <Button @click=" emit('deleteSpan',{index : focusSpan}) " class="scale-[85%]" size="small" severity="danger" icon="pi pi-trash" />
        </div>
        </div>

    </div>
    <div>
      <Divider align="left">
        <b>Regions ({{ spanRefArray.length}})</b>
      </Divider>

        <div v-if="spanRefArray.length == 0">No Regions created yet</div>
        <div v-else class="border-gray-200 border-[1px] p-2 text-nowrap flex flex-col start-0  gap-2">
          <div  v-for="(span,index) in spanRefArray" class="flex flex-row w-full justify-start gap-2" >
          <!-- <div v-if="span != null"> -->
            <div  class="bg-[--color] shrink rounded-xl min-w-6 text-center" :style="`--color: ${span.color}1) `">{{ index +1 }}</div>
              <p class="truncate"> {{span.text}} </p>
            </div>
          <!-- </div> -->
        </div>
    </div>
    <div>
    <p>Relations</p>
    </div>


  </div>
</template>


<script setup>

const emit = defineEmits(['deleteSpan','unselect'])

const { focusSpan, spanRefArray } = defineProps(['focusSpan', 'spanRefArray'])

watchEffect(()=> console.log(spanRefArray))

</script>
