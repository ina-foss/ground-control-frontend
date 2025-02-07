<template>
    <OverlayBadge :value="comments?.length" severity="contrast">
  <div class="w-full rounded-lg text-title">
        <Accordion value="0" class="w-full rounded">
          <AccordionPanel>
            <AccordionHeader class="!bg-white hover:!bg-white rounded ">Commentaires</AccordionHeader>
            <AccordionContent>
              <div class="flex-col">

                <div class="overflow-y-clip overflow-x-hidden mb-3 min-h-fit max-h-[125px]">
                  <ScrollPanel class="h-full " :dt="{
      bar : {
        background: 'var(--primary-color)',
        size:'3px'
      },
      barY:{
        style : 'right: 10px;'
        }
    }">
                    <div v-if="comments?.length != 0" :items="comments" :itemSize="50"
                    >
                      <div v-for="(item, index) in comments" :key="index" class="flex items-center border-b">

                        <div class="flex flex-wrap p-1 gap-2 w-full">
                          <Avatar
                              v-tooltip.top="item.created_by" :label=item.created_by.charAt(0).toUpperCase()
                              shape="circle"
                              class="!bg-[#0057FF] !text-white font-medium h-4 w-4 rounded-full flex items-center justify-center"/>
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
                <div class="font-semibold text-xs mb-3">
                  Nouveau commentaire
                </div>
                <div class="flex flex-col gap-[10px]">
                  <div class="h-20">
                    <Textarea v-model="comment" class="h-full text-xs" fluid placeholder="Entrer votre message"/>
                  </div>
                  <div class="flex justify-center gap-3 ">
                    <Button class="h-auto" label="Annuler" icon="pi pi-times" icon-pos="left" severity="secondary"
                            @click="handleClearComment"/>
                    <Button class="h-auto" label="Envoyer" icon="pi pi-arrow-right" icon-pos="left"
                            @click="handleCreateComment"/>
                  </div>
                </div>
                <!-- input Message-->
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
    </OverlayBadge>
  </div>
</template>

<script setup lang="ts">
import {TaskCommentService, type TaskCommentDto} from '~/api/generate';
import {useAuth} from "~/stores/auth";
import {useService} from "~/composables/useService";

const {$application} = useService();
const toast = useToast()
const refresh = useRefreshStore()
const {userEmail} = useAuth()
const comments = ref<TaskCommentDto[] | null>(null)
const {getData} = refresh

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
    TaskCommentService.createTaskCommentTaskCommentPost({comment: comment.value, task_id: getData.id, created_by: userEmail}).then(() => toast.add({detail: 'Votre commentaire à été envoyé', summary: 'Envoie réussi', life: 3000}))
        .then(() => TaskCommentService.readTaskCommentsByTaskIdTaskCommentsTaskCommentTaskIdGet(getData.id).then((comment) => comments.value = comment))
  }
  comment.value = ""
}

</script>
