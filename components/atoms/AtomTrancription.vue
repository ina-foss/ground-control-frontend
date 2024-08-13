<template>
  <div ref="test" class="bg-surface-200 flex  flex-col p-4 gap-1 drop-shadow-lg rounded transition-all " >
    <div class="flex justify-between pb-2  ">
      <div class="flex  flex-start gap-2 ">
      <Tag :severity="tcColor">
        <div class="flex justify-center items-center gap-3">
          <i class="pi pi-clock" style="font-size: 1.5rem" />
          <p class="text-sm">{{transcriptions[0].tcin}}</p>
        </div>
      </Tag>
      <Tag v-if="confirmedTranscription.index != null" severity="info" class="h-7 self-center "  :value="transcriptionTag" />
      </div>
      <Button icon="pi pi-pencil" size="small" severity="contrast" @click="onExpand()"/>
    </div>
    <div v-if="isExpand == true" class="flex flex-col gap-2 " >
      <div  class="flex flex-row gap-3 w-full ">
        <span v-for="(phrase, index) in transcriptions" :key="index" class="rounded bg-gray-500 text-gray-100 relative p-2 scroll-mt-5 ">
          <Tag severity="secondary" :value="algos[index] " />
          <p>{{ phrase.data.text[0] }}</p>
          <div class="flex justify-end">
           <Button  @click="selectTrancription(phrase, index)" icon="pi pi-check" :outlined="true" rounded style="scale: 0.8;"  severity="success" class=""/>
          </div>
        </span>
      </div>
      <div class="w-full bg-white flex-col items-center rounded p-2 ">
        <div class="flex justify-between pb-2  ">
          <h2>Result</h2>
          <Tag v-if="editedTranscription.index != null" severity="info" :value="transcriptionTag" />
          <p  >edit</p>
        </div>
        <div class="flex justify-center">
          <Textarea :auto-resize="true" style="width: 95%;" v-model="editedTranscription.text" />
        </div>
      </div>
      <div  class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" size="small" @click="onCancel()" />
          <Button label="Confirm" severity="info" size="small" @click=" onFinished()"/>
      </div>
    </div>
    <span v-else :class="`rounded-lg  scroll-mt-5 bg-white p-2 ${textColor} `">
      <p v-if="editedTranscription.text == ''">
        {{ transcriptions[0].data.text[0] }}
      </p>
      <p v-else >{{ editedTranscription.text}}</p>
      </span>

  </div>
</template>


<script setup>
  import Textarea from 'primevue/textarea';

  const emits = defineEmits( ['confirm'])
  const toast = useToast()

  const { transcriptions, algos } = defineProps({
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

  const confirmedTranscription = reactive({phrase: {}, index: null})
  const editedTranscription = reactive({text: '', index: null})

  const isEdited = computed(() => (editedTranscription.text == '' || editedTranscription.text == transcriptions[editedTranscription.index].data.text[0]) ? false : true )
  const transcriptionTag = computed(() => {
    const editedTag =  isEdited.value ? 'custom' : ''
    if (editedTranscription.index != null ) return algos[editedTranscription.index]+' '+ editedTag
    else return ''
  })

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

  const onCancel = () => {
   isExpand=false
    editedTranscription.index = confirmedTranscription.index
    editedTranscription.text = confirmedTranscription.text
  }

  const onFinished = () => {
    if(editedTranscription.index == null) toast.add({summary:'Warning', detail:"You must choose one of the transcription", life: 3000, severity:'warn' })
    else{
      confirmedTranscription.index = editedTranscription.index
      confirmedTranscription.phrase = transcriptions[confirmedTranscription.index]
      confirmedTranscription.phrase.data.text[0] = editedTranscription.text
      confirmedTranscription.edited = isEdited.value
      isFinished=true
      emits('confirm', confirmedTranscription)
      isExpand = false
    }
  }

  const selectTrancription = (phrase, index) => {
    editedTranscription.text = phrase.data.text[0]
    editedTranscription.index = index
  }



</script>
