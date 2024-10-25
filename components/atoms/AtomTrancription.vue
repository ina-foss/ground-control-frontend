<template>
  <div class="flex  flex-col p-4 gap-1 drop-shadow-lg rounded transition-all "
  style="background-color: #EDEDED">

    <!-- Header of the Atom -->
    <div class="flex justify-between pb-2  ">
      <div
class="flex cursor-pointer flex-start gap-2 "
           @click="$emit('onSegmentClick',{tcin: transcriptions[0].tcin})">
        <Tag :class="tcColor">
          <div class="flex justify-center  items-center gap-3">
            <i class="pi pi-clock" style="font-size: 1.5rem"/>
            <p class="text-sm">{{$application.timestampToUnix(transcriptions[0].tcin)  }}</p>
          </div>
        </Tag>
        <Tag style="border: 1px solid #0057FF; color: #0057FF;background-color: white;font-weight: bold"
v-if="confirmedTranscription.index != null" severity="info" class="h-7 self-center "
             :value="transcriptionTag"/>

      </div>
      <Button v-if="status!=='ended'" icon="pi pi-pencil" size="small" severity="contrast" @click="onExpand()"/>
    </div>

    <!-- In EDIT Mode -->
    <div v-if="isExpand == true" class="flex flex-col gap-2 ">
      <div class="flex flex-row gap-3 w-full ">
        <!-- List of available transcriptions -->
        <span style="color: white;background-color: #212529"
v-for="(phrase, index) in transcriptions" :key="index"
              class="rounded w-full text-gray-100 relative p-2 scroll-mt-5 ">
                  <Tag style="border: 1px solid #3379FF; color: #3379FF;background-color: white;font-weight: bold"
                       severity="info" class="h-7 self-center "
                       :value="algos[index]"/>
          <p>{{ phrase.data.text[0] }}</p>
          <div class="flex justify-end">
           <Button
icon="pi pi-check" :outlined="true" rounded  style="scale: 0.8;color: black;background-color: #9ADC82;border-color: #9ADC82"
                   class="" @click="selectTrancription(phrase, index)"/>
          </div>
        </span>
      </div>
      <!-- Selected transcription and Result  -->
      <div class="w-full bg-white flex-col items-center rounded p-2 ">
        <div class="flex pb-2 " style="color: black">
          <h2 class="pr-3">
            Résultat : </h2>
          <Tag style="border: 1px solid #0057FF; color: #0057FF;background-color: white;font-weight: bold"
               v-if="editedTranscription.index != null" severity="info" :value="editTranscriptionTag"/>
        </div>
        <div class="flex justify-center" style="color: black">
          <Textarea v-model="editedTranscription.text" :auto-resize="true" style="width: 95%;color: black"/>
        </div>
      </div>
      <!-- Footer with Buttons -->
      <div class="flex justify-end gap-2">
        <Button class="button button-prev mr-1" label="Annuler" size="small" @click="onCancel()"/>
        <Button
          class="button"
          label="Confirmer"
          size="small"
          @click="onFinished()"
        />
      </div>
    </div>

    <!-- In READING mode  -->
    <span v-else :class="`rounded-lg  scroll-mt-5 bg-white p-2 ${textColor} `">
      <p v-if="editedTranscription.text == ''" >
        {{ transcriptions[0].data.text[0] }}
      </p>
      <p v-else>{{ editedTranscription.text }}</p>
      </span>

  </div>
</template>


<script setup lang="js">
import Textarea from 'primevue/textarea';
import { useService } from '#imports';

const emits = defineEmits(['confirm', 'onSegmentClick'])
const toast = useToast()
const { $application }  = useService()

const {transcriptions, algos, userAnnotation, status} = defineProps({
  transcriptions: {
    type: Array
  },
  algos: {
    type: Array
  },
  userAnnotation: {
    type: Object
  },
  status: {
    type: String
  }
})

let isExpand = $ref(false) // Describe atom render
let isFinished = $ref(false) // If the transcription has been corrected
const confirmedTranscription = reactive({phrase: {}, index: null}) // store the whole amalia lvl 1, update when user confirm
const editedTranscription = reactive({text: '', index: null}) // store just the text, update for every change

if (userAnnotation != null) { // Update values if user had already annoted this transcription

  confirmedTranscription.phrase = userAnnotation
  confirmedTranscription.index = userAnnotation.data.algoIndex
  editedTranscription.text = userAnnotation.data.text[0]
  editedTranscription.index = userAnnotation.data.algoIndex

}

// if the selectedTranscriptoin has been edited
const isEdited = computed(() => (editedTranscription.text == '' || editedTranscription.text == transcriptions[editedTranscription.index]?.data.text[0]) ? false : true)


const editTranscriptionTag = computed(() => { // Value to display in edit Tag
  const editedTag = isEdited.value ? 'custom' : ''
  if (editedTranscription.index != null) return algos[editedTranscription.index] + ' ' + editedTag
  else return ''
})

let transcriptionTag = toValue(editTranscriptionTag) // non-reactive version of editTranscriptionTag

const tcColor = computed(() => {
  return isFinished || (!isExpand && confirmedTranscription.index != null) ?
    'success' :
    'danger'
})

const textColor = computed(() => {
  return isFinished || (!isExpand && confirmedTranscription.index != null) ?
    'text-black' :
    'black'
})

const onExpand = () => {
  isExpand = true
}

const onCancel = () => {
  isExpand = false
  if (confirmedTranscription.index != null) { // reset the edited value to previous confirmed value
    editedTranscription.index = confirmedTranscription.index
    editedTranscription.text = confirmedTranscription.phrase.data.text[0]
  }
}

const onFinished = () => {
  if (editedTranscription.index == null) toast.add({
    summary: 'Warning',
    detail: "You must choose one of the transcription",
    life: 3000,
    severity: 'warn'
  })
  else {
    transcriptionTag = toValue(editTranscriptionTag)
    confirmedTranscription.index = editedTranscription.index
    confirmedTranscription.phrase = JSON.parse(JSON.stringify(transcriptions[confirmedTranscription.index]))
    confirmedTranscription.phrase.data.text[0] = editedTranscription.text
    confirmedTranscription.edited = isEdited.value
    isFinished = true

    emits('confirm', confirmedTranscription)
    isExpand = false
  }
}

const selectTrancription = (phrase, index) => {
  editedTranscription.text = phrase.data.text[0]
  editedTranscription.index = index
}


</script>
<style>
.success{
  background-color: #9ADC82;
  color: black;
}
.danger{
  background-color: #EE4343;
  color: black;
}
</style>
