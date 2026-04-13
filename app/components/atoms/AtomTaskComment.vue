<template>
  <div class="w-full rounded-lg text-title">
        <Accordion value="0" class="w-full rounded ">
          <AccordionPanel>
            <AccordionHeader class="!bg-white hover:!bg-white rounded !border-t-transparent !border-l-transparent !border-r-transparent ">
              <span class="-pr-2">Commentaires</span>
              <span v-if="comments?.length > 0" class="bg-[#B3DDF4] text-white rounded-xl flex justify-center items-center h-[1.5rem] w-[1.5rem]" >{{comments?.length}}</span>
              <span v-if="comments?.length == 0" class="bg-disabled text-white rounded-xl flex justify-center items-center h-[1.5rem] w-[1.5rem]" >{{comments?.length}}</span>
            </AccordionHeader>
            <AccordionContent class="!border-transparent ">
              <div class="flex-col">

            <div v-if="comments?.length != 0" :class="{'overflow-y-clip overflow-x-hidden mb-3 w-full h-fit':true, '!h-[125px]': comments?.length >3}">
                  <ScrollPanel class="h-full" :dt="{
      barY:{
        style : 'right: 10px;'
        }
        ,
      barX:{
          style: 'display: none !important;'
        }
    }">
                    <div  :items="comments" :itemSize="50"
                    >
                      <div v-for="(item, index) in comments" :key="index" class="flex items-center border-b">

                        <div class="flex flex-wrap p-1 gap-2 w-full">
                          <div class="flex justify-between w-full">
                          <Avatar
                              v-tooltip.top="item.created_by" :label=item.created_by.charAt(0).toUpperCase()
                              shape="circle"
                              class="!bg-[#0057FF] !text-white font-medium h-4 w-4 rounded-full flex items-center justify-center"/>
                            <Button
v-if="item.created_by === userEmail" style="height: 22px; padding:0 0 0 0;margin:0;color:#0C7DA2;"
                                    severity="error-state" text rounded
                                    @click="handleDeleteComment(item.id)">
                            <img
                              style="height:18px;width:18px;filter: brightness(0) saturate(100%) invert(48%) sepia(72%) saturate(4640%) hue-rotate(337deg) brightness(98%) contrast(91%);"
                              src="/icons/icons-svg/icons-svg/trash-icon.svg"
                              alt="Trash Icon">
                            </Button>
                          </div>
                          <div class="flex-1 flex flex-col">
                            <div style="word-break: break-word;">
                              <span class="text-sm">
                                {{ item.comment }}
                              </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold text-[10px] text-gray-800 whitespace-nowrap shrink-0">
                                  {{ item.created_by }}
                                </span>
                              <span class="ml-auto font-medium text-[10px] text-gray-800 whitespace-nowrap shrink-0">
                                  {{ $application.formatDate(item.created_at) }}
                                </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </ScrollPanel>

                </div>
                <!--List Messages-->
                <!--List Messages-->
                <!-- input Message-->
                <div v-if="isAnnotationEditable">
                <div  class="font-semibold text-xs mb-3" >
                  Nouveau commentaire
                </div>
                <div class="flex flex-col gap-[10px]">
                  <div class="h-20">
                    <Textarea v-model="comment" class="h-full text-xs" fluid placeholder="Entrer votre message"/>
                  </div>
                  <div class="flex justify-center gap-3 ">
                    <Button
class="h-auto" outlined label="Annuler" icon="pi pi-times" icon-pos="left"
                            @click="handleClearComment"/>
                    <Button
class="h-auto" label="Envoyer" icon="pi pi-arrow-right" icon-pos="left"
                            @click="handleCreateComment"/>
                  </div>
                </div>
                <!-- input Message-->
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
  </div>
</template>

<script setup lang="ts">
import { TaskComment, type TaskCommentDto } from '~/api/generate';
import {useAuth} from "~/stores/auth";
import {useService} from "~/composables/useService";

const {$application} = useService();
const toast = useToast()
const refresh = useRefreshStore()
const {userEmail} = useAuth()
const comments = ref<TaskCommentDto[] | null>(null)
const {getData} = refresh
const isAnnotationEditable = inject('isAnnotationEditable')

onMounted(async () => {
  comments.value = getData.task_comments
})

const comment = ref('')
const panel = ref(null)

function handleClearComment() {
  comment.value = ''
  panel.value.toggle()
}

function handleCreateComment() {
  if (comment.value != '') {
    createTaskCommentTaskCommentPost({comment: comment.value, task_id: getData.id, created_by: userEmail}).then(() => toast.add({detail: 'Votre commentaire à été envoyé', summary: 'Envoie réussi', life: 3000}))
        .then(() => readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(getData.id).then((comment) => comments.value = comment))
  }
  comment.value = ""
}


const handleDeleteComment = async (id) => {
  const { execute } = await useAsyncData(
    `deleteComment-${id}`,
    async () => {
      await TaskComment.deleteTaskCommentTaskCommentTaskCommentIdDelete(id);
      comments.value = await TaskComment.readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(getData.id);

    },
    { immediate: false,
      onSuccess: () => {
        toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Commentaire supprimé avec succès',
          life: 3000
        });
      },
      onError: (error) => {
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: `Échec de la suppression du commentaire : ${error.message || 'Erreur inconnue'}`,
          life: 3000
        });
      }}
  );
  await execute()
};


</script>
