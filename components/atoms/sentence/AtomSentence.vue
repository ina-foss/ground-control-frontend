<template>
  <div  v-if="transcriptions.length" class="flex bg-neutral flex-col p-4 gap-3  rounded transition-all " :data-tc=transcriptions[0].tcin>
      <div
        class="flex cursor-pointer items-center flex-start gap-2  w-full"
        @click="transcriptions[0].data.topic ? jumpToTopic({topic: transcriptions[0].data.topic }) : handleSegmentClick({tcin: transcriptions[0].tcin,tcout: transcriptions[0].tcout}) ">
        <Tag :severity="'contrast'" >
          <div class="flex justify-center  items-center gap-3">
            <i class="pi pi-clock" style="font-size: 1.5rem"/>
            <p class="text-sm">{{timestampToUnix(transcriptions[0].tcin)  }}</p>
          </div>
        </Tag>
        <span v-if="transcriptions[0].data.topic" class="font-bold flex-1 overflow-hidden text-ellipsis line-clamp-2 ">
        {{ topicList[transcriptions[0].data.topic]?.title || `Topic  ${transcriptions[0].data.topic}` }}
        </span>
      </div>
      <div class="flex flex-col gap-4 " v-if="spanArrayByTopic.length">
        <div v-for="span in spanArrayByTopic" :key="span" class=" flex items-center bg-secondary-color border-extra2 border p-3 gap-2 rounded h-fit justify-between ">
          <span class="font-bold  ">{{extractTextFromSpanNodes(span.nodes)}}</span>
          <span class="pi pi-trash h-full cursor-pointer hover:bg-disabled p-1 rounded-full " @click="onDeleteSpan({index: span.id})" style="font-size: 1.4rem" ></span>
        </div>
      </div>
      <div v-else>
        <div class=" flex items-center border-extra2 border p-3 rounded h-fit justify-between ">
          <span class="font-bold  ">Aucune phrase selectionnee</span>
        </div>
      </div>
    </div>
</template>


<script src="./atom-sentence-component.ts"></script>
