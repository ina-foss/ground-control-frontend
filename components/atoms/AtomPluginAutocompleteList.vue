<template>
  <Toast/>
  <Dialog
      :visible="dialogVisible"
      modal
      :style="{ width: '30%'}"
      class="bg-white"
      @after-hide="deleteDialog = false"
      @update:visible="emits('toggle-dialog')">
    <template #header>
      <div class="row flex">
        <div class="col">
          <Tag severity="contrast">
            <div class="flex justify-center  items-center gap-3">
              <i class="pi pi-clock" />
              <p class="text-sm">{{$application.timestampToUnix(phrase.tcin) }}</p>
            </div>
          </Tag>
        </div>
        <div  :class="`h-8 pt-3 pb-3 pl-3  w-fit flex items-center mb-3 font-bold `">{{title}}</div>
      </div>

    </template>
    <div>

      <div class="row">
        <AtomPluginBlock :topicIndex="topicIndex" :isTopicFirstSegment="isTopicFirstSegment"  />
      </div>

    </div>

  </Dialog>
</template>


<script setup lang="ts">
import {useService} from "~/composables/useService.js";
import AtomPluginBlock from "../atoms/AtomPluginBlock.vue";

const props = defineProps<{
  dialogVisible: boolean;
  phrase: any;
  title: string;
  topicIndex: number;
  isTopicFirstSegment: boolean;
}>();

const { dialogVisible, phrase, title, topicIndex, isTopicFirstSegment } = toRefs(props);
const emits = defineEmits(['toggle-dialog'])
const deleteDialog = ref(false)
const { $application } = useService()

console.log(topicIndex)
console.log(isTopicFirstSegment)
</script>
