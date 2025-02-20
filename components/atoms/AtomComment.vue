<template>
   <div class="w-[300px] flex flex-col gap-[12px] ">
      <!-- Header  -->
      <div class="w-full flex justify-between items-center">
      <b>{{ isEdited ? 'Edition' : 'Commentaire'}} </b>
        <i class="pi pi-times rounded-2xl p-1 hover:bg-secondary-color cursor-pointer"  text @click="overlay.hide()" />
      </div>
      <!-- Text aera -->
      <div v-if="!phrase.data.comments || phrase.data.comments.length == 0" class="flex w-full gap-2 justify-between">
        <InputText v-model="commentText" placeholder="Ajouter un commentaire"  class="w-[90%]"/>
        <Button class="hover:!bg-primary"  icon="pi pi-arrow-right" @click="createComment" />
      </div>
      <div v-else>
        <div class="flex flex-col gap-[12px]" v-for="comment in phrase.data.comments">
          <InputText v-if="isAnnotationEditable" v-model=comment.text variant="filled"  @focus=" startEdit" />
        <span v-else class="border p-sm rounded-md"> {{comment.text}}</span>
          <div v-if="!isEdited" class="flex justify-between ">
            <p> {{ comment.createdAt }}</p>
            <p class="truncate max-w-[150px]"> {{ comment.createdBy }}</p>
          </div>
          <div v-else class="flex gap-2 justify-end">
            <Button icon="pi pi-times" severity="secondary" @click="cancelEdit"  />
            <Button class="hover:!bg-primary"  icon="pi pi-check" @click="editComment" />
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">

const { phrase, overlay } = defineProps({
  phrase: {type: Object},
  overlay: {type: Object},
})

const { userEmail } = useAuth()

const commentText = ref('')
let lastText = ''
const test = ref(document.activeElement?.tagName)
const isEdited = ref(false)
const isAnnotationEditable = inject('isAnnotationEditable')

function startEdit () {
  if(isAnnotationEditable){
    isEdited.value = true
    lastText = phrase.data.comments[0].text
  }
}
function editComment () {
  const date : Date = new Date(Date.now())
  const formattedDate = date.toLocaleString('FR', { day: 'numeric', month:'short', year:'numeric' });
  isEdited.value = false
  phrase.data.comments[0].createdAt =  formattedDate

}

function cancelEdit () {
  phrase.data.comments[0].text = lastText
  isEdited.value = false
}


function createComment() {
    const date : Date = new Date(Date.now())
    const formattedDate = date.toLocaleString('FR', { day: 'numeric', month:'short', year:'numeric' });
    let a = { }
    a.text = commentText.value
    a.createdAt = formattedDate
    a.type = 'COMMENT'
    a.createdBy= userEmail
    if(!phrase.data.comments) phrase.data.comments= []
    phrase.data.comments.push(a)
}
</script>
