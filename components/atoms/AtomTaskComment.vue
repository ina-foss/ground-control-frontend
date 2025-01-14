<template>
  <div class="w-[250px] bg-white rounded-lg">
    <OverlayBadge :value="comments?.length" severity="contrast">
      <Panel ref="panel" class="w-full" header="Alerte Message" toggleable collapsed>
        <div class="flex flex-col gap-[10px]">
          <div class="h-20">
            <Textarea v-model="comment" class="h-full" fluid placeholder="Entrez votre message" />
          </div>
          <div class="flex justify-end gap-3 ">
            <Button label="Annuler" severity="secondary" @click="handleClearComment" />
            <Button label="Envoyer" @click="handleCreateComment" />
          </div>
        </div>
      </Panel>
    </OverlayBadge>
  </div>
</template>

<script setup lang="ts" >
  import { TaskCommentService, type TaskCommentDto } from '~/api/generate';

  const toast = useToast()
  const refresh = useRefreshStore()

  const comments = ref<TaskCommentDto[] | null >(null)
  const { getData } = refresh
  // const data = inject('data')

  onMounted( async ()=>{
     // TaskCommentService.readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(getData.id).then((comment)=>comments.value=comment)
    comments.value = getData.task_comments
  })

  const comment = ref('')
  const panel = ref(null)

  function handleClearComment () {
    comment.value=''
    panel.value.toggle()
  }

  function handleCreateComment() {
    if(comment.value != ''){
      TaskCommentService.createTaskCommentTaskCommentPost({comment: comment.value, task_id: getData.id}).then(()=> toast.add({detail:'Votre commentaire à été envoyé', summary:'Envoie réussi', life:3000 }))
        .then(()=>TaskCommentService.readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(getData.id).then((comment)=>comments.value = comment))
    }
  }

</script>
