<template>
  <div ref="test" class="bg-surface-100 flex flex-col p-4 gap-1 drop-shadow-lg transition-max-height " >
    <div class="flex justify-between pb-2  ">
      <Tag :severity="tcColor">
        <div class="flex justify-center items-center gap-3">
          <i class="pi pi-clock" style="font-size: 1.5rem" />
          <p class="text-sm">{{transcriptions[0].tcin}}</p>
        </div>
      </Tag>
      <Button icon="pi pi-pencil" size="small" severity="contrast" @click="onExpand()"/>
    </div>
    <div v-if="isExpand == true" class="flex flex-col gap-2 " >
      <div  class="flex flex-row gap-3 w-full ">
        <span v-for="(phrase, index) in transcriptions" :key="index" class="rounded bg-gray-500 text-gray-100 relative p-2 scroll-mt-5 ">
          <Tag severity="secondary" :value="algos[index]" />
          <p>{{ phrase.data.text[0] }}</p>
          <div class="flex justify-end">
           <Button  @click="selectTrancription(phrase, index)" icon="pi pi-check" :outlined="true" rounded style="scale: 0.8;"  severity="success" class=""/>
          </div>
        </span>
      </div>
      <div class="w-full bg-white flex-col items-center p-2 ">
        <div class="flex justify-between pb-2  ">
          <h2>Result</h2>
          <Tag v-if="selectedTranscription.index" severity="info" :value="algos[selectedTranscription.index]" />
          <p  >edit</p>
        </div>
        <div class="flex justify-center">
          <Textarea :auto-resize="true" style="width: 95%;" v-model="selectedTranscription.text" />
        </div>
      </div>
      <div  class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" size="small" @click="isExpand=false" />
          <Button label="Confirm" severity="info" size="small" @click=" onFinished()"/>
      </div>
    </div>
    <span v-else :class="`rounded-lg  scroll-mt-5 bg-white p-2 ${textColor} `">
      <p v-if="selectedTranscription.text == ''">
        {{ transcriptions[0].data.text[0] }}
      </p>
      <p v-else >{{ selectedTranscription.text}}</p>
      </span>

  </div>
</template>


<script setup>
  import Textarea from 'primevue/textarea';

  const { transcriptions,algos } = defineProps({
    transcriptions: {
      type: Array
    },
    algos: {
      type: Array
    }
  })

  let isExpand = $ref(false) // Describe atom render
  let isFinished = $ref(false) // If the transcription has been corrected
  const test = ref()
  const selectedTranscription = reactive({text: '', index: null})

  const tcColor = computed(()=>{
    return isFinished ?
      'success' :
      'danger'
  })

  const textColor = computed(() => {
      return isFinished ?
        'text-black' :
        'text-gray-500'
  })

  const onExpand = () => {
    isExpand = true
  }

  const onFinished = () => {
    isFinished=true
    isExpand = false
  }

  const selectTrancription = (phrase, index) => {
    selectedTranscription.text = phrase.data.text[0]
    selectedTranscription.index = index
  }



</script>
