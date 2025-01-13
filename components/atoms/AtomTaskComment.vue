<template>
  <div class="w-[250px] bg-white rounded-lg">
    <OverlayBadge :value="comments?.length" severity="contrast">
      <Panel ref="panel" class="w-full" header="Alerte Message" toggleable collapsed>
        <!--List Messages-->
        <div :items="comments" :itemSize="50" class="mb-3 border border-surface-200 dark:border-surface-700 rounded " style="height:125px; overflow-y: auto">
          <div v-for="(item, index) in comments" :key="index" class="flex items-center border-b" >
                <div class="flex flex-wrap p-1 items-start gap-2 w-full">
                  <Avatar
                    v-tooltip.top="item.created_by" :label=item.created_by.charAt(0).toUpperCase()
                    shape="circle"
                    class="bg-blue-600 text-white font-medium h-6 w-6 rounded-full flex items-center justify-center"/>
                  <div class="flex-1 flex flex-col">
                    <div class="flex justify-between items-start">
                      <span class="font-medium text-[10px] text-gray-800 whitespace-nowrap shrink-0">
                        {{$application.formatDate(item.created_at)}}
                      </span>
                    </div>
                    <div style="word-break: break-word;">
                      <span class="text-sm">
                        {{ item.comment }}
                      </span>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <!--List Messages-->
        <!-- input Message-->
        <div class="flex flex-col gap-[10px]">
          <div class="h-20">
            <Textarea v-model="comment" class="h-full" fluid placeholder="Entrez votre message" />
          </div>
          <div class="flex justify-end gap-3 ">
            <Button label="Annuler" severity="secondary" @click="handleClearComment" />
            <Button label="Envoyer" @click="handleCreateComment" />
          </div>
        </div>
        <!-- input Message-->
      </Panel>
    </OverlayBadge>
  </div>
</template>

<script setup lang="ts" >
  import { TaskCommentService, type TaskCommentDto } from '~/api/generate';
  import {useAuth} from "~/stores/auth";
  import {useService} from "~/composables/useService";
  const { $application } = useService();
  const toast = useToast()
  const refresh = useRefreshStore()
  const {userEmail} = useAuth()
  const comments = ref<TaskCommentDto[] | null >(null)
  const { getData } = refresh

  onMounted( async ()=>{
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
      TaskCommentService.createTaskCommentTaskCommentPost({comment: comment.value, task_id: getData.id,created_by:userEmail}).then(()=> toast.add({detail:'Votre commentaire à été envoyé', summary:'Envoie réussi', life:3000 }))
        .then(()=>TaskCommentService.readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(getData.id).then((comment)=>comments.value = comment))
    }
  }

</script>
