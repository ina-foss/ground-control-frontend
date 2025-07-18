<template>
  <div class="bg-white max-w-full w-full h-fit p-6 overflow-scroll" >
    <div>
      <b class="text-xl">Spans</b>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <span-wrapper class="overflow-auto max-h-[500px] block">
        <span-content-wrapper v-for="(span,index) in spanOnlyArray"
            :key="span.id" draggable="true" :class="[' flex p-2 flex-row items-center gap-1 hover:bg-primary-50 cursor-pointer overflow-hidden transition-all duration-300 expand-type' ] "
          @dragstart="event=>event.dataTransfer.setData('span', span.id)">
          <span-number class="font-bold self-center px-2">  {{index+1}} </span-number>
          <span
  :style="{backgroundColor : computeColorByLabel(spanTypeOptions.map(opt=>opt?.label),[span?.type?.label]).hex +'66', borderColor:computeColorByLabel(spanTypeOptions.map(opt=>opt?.label),[span?.type?.label]).hex, '--computed-width' : getMinSizeText(span) + 'px' }"
            class="min-w-[80px] w-[80px] transition-all duration-300 p-1 rounded border-4 inline-block text-xs/3 h-fit truncate text-center hover-span" >
            {{span?.type?.label}}
          </span>
          <span class="self-center font-semibold flex-1 truncate">{{span?.label ?? extractTextFromSpanNodes(span.nodes)}}</span>
          <span v-if="span?.label" class="text-subtitle truncate flex  grow max-w-[40%] "  >
            {{extractTextFromSpanNodes(span.nodes)}}
          </span>
        </span-content-wrapper>
      </span-wrapper>
    </div>
    <div class="py-2">
      <b class="text-xl">Groupe Courrant  </b>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div :class="{' grid  transition-all duration-300 overflow-hidden': true}" :style="{'grid-template-rows' : groupIsSelected ? '1fr': '0fr'}" >
        <selected-group-content v-show="selectedGroup" :style="{'min-height' : 0}"  >
          <div
  :style="{backgroundColor : computeColorByLabel(spanGroupTypeOptions.map(opt=>opt?.label),[selectedGroup?.type?.label]).hex +'66', borderColor:computeColorByLabel(spanGroupTypeOptions.map(opt=>opt?.label),[selectedGroup?.type?.label]).hex,}"
            class=" p-1 rounded border-4 w-fit text-xs/3 h-fit truncate text-center hover-span" >
            {{selectedGroup?.type?.label}}
          </div>
          <span class="font-semibold">Roles</span>
          <role-wrapper class="grid" style="grid-template-columns: repeat(auto-fit,minmax(150px, 1fr));">
            <div v-for="role in selectedGroup?.type?.roles" class="p-2  border-surface-200   text-center">
              <ScrollPanel class=" h-[150px] border border-surface-400 rounded " >
                <role-dropzone
                  class="flex flex-col text-start gap-1 h-full w-full "
                  @drop="dropSpan($event,selectedGroup,role)" @dragover="event=>event.preventDefault()" @dragenter="previewSpanDrop" @dragleave="unpreviewSpanDrop">
                  <role-span-title class="text-center">{{ role }}</role-span-title>
                  <role-span-content v-for="span in selectedGroup?.spans.filter(span => span.role == role ).sort((a,b)=>unixToTimestamp(spanArray[a.spanId].tcin) - unixToTimestamp(spanArray[b.spanId].tcin))" :key="span.id" :style="{ backgroundColor : computeColorByLabel(spanTypeOptions.map(opt=>opt.label),[spanArray[span.spanId]?.type?.label]).hex + '66'}" class=" px-1 truncate mr-2 max-w-full w-fit rounded ">{{ spanArray[span.spanId]?.label ?? extractTextFromSpanNodes(spanArray[span.spanId]?.nodes)}}</role-span-content>
                  <virtual-span-preview  class="w-full flex flex-col items-center justify-center cursor-pointer " @click="spanForm.open({virtual: true, role: role})" >
                      <div class="h-6 w-6 rounded-full text-xl bg-primary-500 leading-5 text-center ">+</div>
                       <div class="text-subtitle"> nouveau span virtuel</div>
                  </virtual-span-preview>
                </role-dropzone>
              </ScrollPanel>
            </div>
          </role-wrapper>
        </selected-group-content>
      </div>
    </div>
    <div class="flex flex-col">
      <category-header class="flex flex-row justify-between items-center">
        <b class="text-xl">Liste des groupes</b>
        <Button icon="pi pi-plus" icon-pos="right" label="Ajouter" rounded outlined size="small" class="self-end " @click="emit('handleNewGroup',$event)" />
      </category-header>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div class="flex flex-col gap-3">
        <group-wrapper
          :key="group.id"
            v-for=" (group,index) in groupArray" :class="{' hover:bg-primary-100 cursor-pointer p-2 rounded-md flex items-center' :true, 'border-2 bg-surface-100 border-title font-semibold' : newFocus== group.id}"
            @click="handleGroupClick(group.id)" >
            <group-number class="font-bold self-center px-2 h-fit">  {{index+1}} </group-number>
            <group-label class="grow">{{ group?.label ?? group.type?.label }}</group-label>
            <span class="  text-center rounded-full p-0 text-xl leading-10  h-10 w-10 bg-surface-100  ">{{ group.spans.length }}</span>
          </group-wrapper>
      </div>
    </div>
  </div>

</template>

<script src="./span-control-panel-component.ts"></script>

<style scoped >
.hover-span:hover, .expand-type:hover .hover-span {
  width: var(--computed-width) !important
}
virtual-span-preview{
  flex: 0 1 0%;
  height: 0px;
  display: none
  }

role-dropzone:hover virtual-span-preview, virtual-span-preview:hover {
  flex-grow: 1;
  height: auto;
  display: flex
}

</style>

