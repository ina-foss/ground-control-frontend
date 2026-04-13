<template>
  <div class="flex bg-disabled flex-col p-4 gap-1  rounded transition-all " :data-tc=transcriptions[0].tcin>

    <!-- Header of the Atom -->
    <div class="flex justify-between pb-2  ">
      <div
class="flex cursor-pointer items-center flex-start gap-2  w-full"
        @click="transcriptions[0].data.topic ? jumpToTopic({topic: transcriptions[0].data.topic }) : handleSegmentClick({tcin: transcriptions[0].tcin,tcout: transcriptions[0].tcout}) ">
        <Tag :severity="tcColor" class="!text-black" >
          <div class="flex justify-center  items-center gap-3">
            <i class="pi pi-clock" style="font-size: 1.5rem"/>
            <p class="text-sm">{{$application.timestampToUnix(transcriptions[0].tcin)  }}</p>
          </div>
        </Tag>
        <Tag
v-if="transcriptionTag != ' '"
style="border: 1px solid #0057FF; color: #0057FF;background-color: white;font-weight: bold" severity="info" class="h-7 self-center flex-nowrap  whitespace-nowrap "
             :value="transcriptionTag"/>
        <span v-if="transcriptions[0].data.topic" class="font-bold overflow-hidden text-ellipsis line-clamp-2 ">
          {{ topicList[transcriptions[0].data.topic]?.title }}
        </span>
      </div>
      <Button v-if="status!==Status.DONE" icon="pi pi-pencil" size="small" severity="secondary" text @click="onExpand()"/> </div>

    <!-- In EDIT Mode -->
    <div v-if="isExpand == true" class="flex flex-col gap-2 ">
      <div class="grid gap-3 w-full " style="grid-template-columns: repeat(auto-fit,minmax(250px,1fr));">
        <!-- List of available transcriptions -->
        <span
v-for="(phrase, index) in transcriptions"
:key="index" style="color: white;background-color: #212529"
              class="rounded w-full text-gray-100 relative p-2  scroll-mt-5 ">
                  <Tag
style="border: 1px solid #3379FF; color: #3379FF;background-color: white;font-weight: bold"
                       severity="info" class="h-7 self-center my-1 "
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
        <div class="flex pb-2 items-center " style="color: black">
          <h2 class="pr-3">
            Résultat : </h2>
          <Tag
v-if="editTranscriptionTag != ' '"
               style="border: 1px solid #0057FF; color: #0057FF;background-color: white;font-weight: bold" severity="info" :value="editTranscriptionTag"/>
        </div>
        <Textarea v-model="editedTranscription.text" :auto-resize="true" style="width: 95%;color: black"/>
        <div class="flex justify-center" style="color: black"/>
      </div>
      <!-- Footer with Buttons -->
      <div class="flex justify-end gap-2">
        <Button class=" mr-1" label="Annuler" outlined size="small" @click="onCancel()"/>
        <Button
          class="button"
          label="Confirmer"
          size="small"
          @click="onFinished()"
        />
      </div>
    </div>

    <!-- In READING mode  -->
    <span v-else :class="`rounded-lg  scroll-mt-5 bg-white p-2 ${textColor} customText`">
      <p v-if="editedTranscription.text == ''" class="" >
        {{ transcriptions[0].data.text[0] }}
      </p>
      <p v-else>{{ editedTranscription.text }}</p>
      </span>

  </div>
</template>


<script setup lang="js">
import Textarea from 'primevue/textarea';
import { useService } from '#imports';

import { useTopicList } from '../../composables/useTopicList'
import {Status as Status} from '../../api/generate';
const emits = defineEmits(['confirm', 'onSegmentClick'])
const toast = useToast()
const { $application }  = useService()

const { topicList } = useTopicList()

const jumpToTopic = inject('jumpToTopic')
const handleSegmentClick = inject('handleSegmentClick')

const {transcriptions, algos, userAnnotation, status} = defineProps({
  transcriptions: {
    type: Array
  },
  algos: {
    type: Array,
    required: true
  },
  userAnnotation: {
    type: Object
  },
  status: {
    type: String
  }
})
const isExpand = ref(false) // Describe atom render
const confirmedTranscription = reactive({phrase: {}, index: null}) // store the whole amalia lvl 1, update when user confirm
const isFinished = computed(()=>confirmedTranscription.index != null) // If the transcription has been correctedh
const editedTranscription = reactive({text: '', index: null}) // store just the text, update for every change

if (userAnnotation != null) { // Update values if user had already annoted this transcription

  confirmedTranscription.phrase = userAnnotation
  confirmedTranscription.index = userAnnotation.data.algoIndex
  editedTranscription.text = userAnnotation.data.text[0]
  editedTranscription.index = userAnnotation.data.algoIndex
  editedTranscription.edited = userAnnotation.data.edited


}

// if the selectedTranscriptoin has been edited
const isEdited = computed(() => (editedTranscription.text != '' && editedTranscription.text != transcriptions[editedTranscription.index]?.data.text[0]) || confirmedTranscription.phrase.data?.edited )


const editTranscriptionTag = computed(() => { // Value to display in edit Tag
  const editedTag = isEdited.value ? 'custom' : ''
  return (algos[editedTranscription.index] ?? "") + ' ' + editedTag
})

let transcriptionTag = toValue(editTranscriptionTag) // non-reactive version of editTranscriptionTag

const tcColor = computed(() => {
  return isFinished.value || (!isExpand.value && isEdited.value) ?
    'success' :
    'danger'
})

const textColor = computed(() => {
  return isFinished.value || (!isExpand.value && confirmedTranscription.index != null) ?
    'text-black' :
    'black'
})

const onExpand = () => {
  isExpand.value= true
}

const onCancel = () => {
  isExpand.value = false
  if (confirmedTranscription.index != null) { // reset the edited value to previous confirmed value
    editedTranscription.index = confirmedTranscription.index
    editedTranscription.text = confirmedTranscription.phrase.data.text[0]
  }
}

const onFinished = () => {
  transcriptionTag = toValue(editTranscriptionTag)
  confirmedTranscription.index = editedTranscription.index
  // On choisit la premiere transcriptions quoiqu'il arrive car
  // les metadata des toutes les transcriptions sont identique sauf le text et l'algo
  confirmedTranscription.phrase = JSON.parse(JSON.stringify(transcriptions[0]))
  confirmedTranscription.phrase.data.text[0] = editedTranscription.text
  confirmedTranscription.edited = isEdited.value

  emits('confirm', confirmedTranscription)
  isExpand.value = false
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
