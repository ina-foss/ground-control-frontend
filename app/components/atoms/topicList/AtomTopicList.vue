<template>
  <div class=" rounded-b-md  w-full gap-3 bg-white h-full ">
    <div class="flex flex-col gap-[10px] text-title p-lg  !h-full">
      <div v-if="cleanedColors?.length != 0" :items="cleanedColors" :itemSize="50" class="w-full h-full  ">
        <ScrollPanel class="h-full" :dt="{
          barY: {
            style: 'right: -10px;'
          }
        }">
          <div v-for="(color, index ) in cleanedColors" :key="index">
            <div class="flex pb-2 items-start gap-2 w-full overflow-visible">
              <div
class="flex h-8 items-center hover:bg-neutral gap-2  hover:cursor-pointer overflow-visible w-full "
                @click="emit('topicClick', { topic: parseInt(index) })">
                <div
:style="styleTopicCircle(computeColor(parseInt(index)).hex)"
                  class="min-w-4 h-4 place-content-center relative rounded-full flex  font-bold overflow-visible justify-center z-10 items-center text-white text-[10px] " />
                <span v-if="topicList[parseInt(index)]?.labels.length " class="pi pi-check-square " />
                <h2
class=" shrink  font-semibold h-fit overflow-hidden text-ellipsis line-clamp-2 "
                  style="line-height: 16px;">{{ preventDefaultTitle(topicList[parseInt(index)]) }}</h2>
              </div>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </div>
  </div>
</template>
<script src="./atom-topic-list-component.ts"></script>
