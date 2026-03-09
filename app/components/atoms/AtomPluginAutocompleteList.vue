<template>
  <Dialog
      :visible="dialogVisible"
      modal
      :style="{ width: '50%',height:'fit'}"
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

      <div>
        <AtomPluginBlock v-model:plugin-values="pluginValues" :topic-index="topicIndex" :is-topic-first-segment="isTopicFirstSegment" :source="dialogVisible" />
      </div>

    </div>

  </Dialog>
</template>


<script setup lang="ts">
import {useService} from "~/composables/useService.js";
import AtomPluginBlock from "./pluginBlock/AtomPluginBlock.vue";
import type { PluginAutocompleteValueWithMetadata } from "~/composables/useSpanService";

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
const pluginValues = defineModel<Record<string,PluginAutocompleteValueWithMetadata>>('pluginValues')
const { $application } = useService()
</script>
