<template>
  <div class="bg-white max-w-full w-full h-fit p-6" >
    <div>
      <panel-span-header class="flex justify-between items-center">
        <b class="text-xl">Spans</b>
        <span-filter v-if="mainPluginId" class="flex items-center gap-2">
          {{ mainPluginName?.charAt(0).toUpperCase() + mainPluginName?.slice(1) }}
          <Select
            v-model="spanFilter"  placeholder="Tous" :show-clear="true"
            :options="pluginOptionsList?.find(p=>p.id==mainPluginId)?.data" option-label="label"  />
        </span-filter>
      </panel-span-header>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <ScrollPanel :style="{ maxHeight: '340px', height: spanOnlyArray.length < 8 ? 'auto' : '340px' }"
                   class="overflow-auto"
                   :dt="{
    bar: { background: 'var(--primary-color)', size: '5px' },
    barY: { style: 'right: -5px;' }
  }"
      >
        <TabPanels class="overflow-x-hidden p-0 h-fit">
          <TabPanel value="span" class="p-0 h-fit" >
            <span-wrapper class="block">
        <span-content-wrapper
            v-for="(span,index) in spanOnlyArray"
            :key="span?.id" draggable="true" :class="[' flex p-2 flex-row items-center gap-1 hover:bg-primary-50 cursor-pointer transition-all duration-300 expand-type' ] "
          @dragstart="event=>{
            event.dataTransfer.setData('span', span.id)
            event.dataTransfer.setDragImage([...event.target.children][1],10,10)
          }">
          <span-number class="font-bold self-center px-2">  {{index+1}} </span-number>
          <AtomSpanTag :plugin-id="mainPluginId" :plugin-value="span?.plugins?.[mainPluginIndex]" :text="span?.plugins?.[mainPluginIndex]?.map(value=>value?.label).join(', ')"  expandable />
          <span class="self-center font-semibold flex-1 truncate">{{span?.label ?? extractTextFromSpanNodes(span?.nodes)}}</span>
          <span v-if="span?.label" class="text-subtitle text-end italic truncate  grow max-w-[40%] "  >
            {{extractTextFromSpanNodes(span?.nodes)}}
          </span>
        </span-content-wrapper>
      </span-wrapper>
          </TabPanel>
        </TabPanels>
      </ScrollPanel>
    </div>
    <div v-if="isForResearch && mainGroupPluginId" class="py-2">
      <div class="flex justify-between items-center  h-7">
        <group-title-wrapper class="flex justify-start items-center gap-3" >
          <b class="text-xl">Groupe Courant  </b>
          <AtomSpanTag
            v-if="groupIsSelected"
            :plugin-id="mainGroupPluginId"
            :plugin-value="selectedGroup?.plugins[mainGroupPluginIndex]"
            :text="selectedGroup?.plugins[mainGroupPluginIndex]?.[0]?.label"
          />
        </group-title-wrapper>
        <layout-button-wrapper v-if="groupIsSelected" class="flex gap-3">
          <span :class="['pi pi-th-large text-2xl cursor-pointer ', layout == 'grid' ? 'opacity-100' : 'opacity-50']" @click="()=>layout = 'grid' " > </span>
          <span :class="['pi pi-list text-2xl cursor-pointer ', layout == 'list' ? 'opacity-100' : 'opacity-50' ] "  @click="()=>layout = 'list' " > </span>
        </layout-button-wrapper>
      </div>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div :class="{' grid  transition-all duration-300 overflow-hidden': true}" :style="{'grid-template-rows' : groupIsSelected ? '1fr': '0fr'}" >
        <selected-group-content v-show="selectedGroup" :style="{'min-height' : 0}"  >
          <role-wrapper class="grid" :style="`grid-template-columns: repeat(auto-fit,minmax(${ layout == 'grid' ? '150px' : '1fr'}, 1fr));`">
            <div v-for="role in selectedGroup?.plugins[mainGroupPluginIndex]?.[0].categories" :key="role" class="p-2  border-surface-200   text-center">
              <ScrollPanel class=" h-[150px] border-2 border-dashed border-surface-400 rounded-md " >
                <role-dropzone
                  class="flex flex-col text-start h-full w-full gap-[10px] p-[10px] bg-secondary-color "
                  @drop="dropSpan($event,selectedGroup,role)" @dragover="event=>event.preventDefault()" @dragenter="previewSpanDrop" @dragleave="unpreviewSpanDrop">
                  <role-span-title class="text-center font-bold ">{{ role }}</role-span-title>
                  <group-linked-span
                    v-for="span in selectedGroup?.spans.filter(span => span.role == role ).sort((a,b)=>unixToTimestamp(spanArray[a.spanId].tcin) - unixToTimestamp(spanArray[b.spanId].tcin))"
                    :key="span" class="flex justify-between items-center max-w-full span-tag ">
                    <AtomSpanTag
                      :plugin-id="mainPluginId" :plugin-value="spanArray[span.spanId]?.plugins?.[mainPluginIndex]"
                      :text="spanArray[span.spanId]?.label || extractTextFromSpanNodes(spanArray[span.spanId]?.nodes) || spanArray[span.spanId]?.plugins?.[mainPluginIndex]?.map(value=>value.label).join(', ')"   />
                      <span class="pi pi-trash  hover:bg-disabled rounded-full p-1" @click="unlinkSpan(span,selectedGroup)" />
                  </group-linked-span>
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
    <div v-if="isForResearch && mainGroupPluginId" class="flex flex-col">
      <category-header class="flex flex-row justify-between items-center">
        <b class="text-xl">Liste des groupes</b>
        <div class="flex items-center gap-4">
          <group-filter v-if="mainGroupPluginId" class="flex items-center gap-2">
            {{ mainGroupPluginName?.charAt(0).toUpperCase() + mainGroupPluginName?.slice(1) }}
            <Select
              v-model="groupFilter"  placeholder="Tous" :show-clear="true"
              :options="pluginOptionsList?.find(p=>p.id==mainGroupPluginId)?.data" option-label="label"  />
          </group-filter>
          <Button icon="pi pi-plus" icon-pos="right" :disabled="isReadMode" label="Ajouter" rounded outlined size="small" class="self-end " @click="emit('handleNewGroup',$event)" />
        </div>
      </category-header>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div class="flex flex-col gap-3">
        <group-wrapper
          :key="group.id"
            v-for=" (group,index) in groupArray" :class="{' hover:bg-primary-100 cursor-pointer p-2 rounded-md flex items-center gap-2' :true, 'border-2 bg-surface-100 border-title font-semibold' : newFocus== group.id}"
            @click="handleGroupClick(group.id)" >
            <group-number class="font-bold self-center px-2 h-fit">  {{index+1}} </group-number>
            <group-label class="grow">{{ group?.label || group?.plugins[mainGroupPluginIndex]?.[0].label  }}</group-label>
            <group-span-count class="  text-center rounded-full p-0 text-xl leading-10  h-10 w-10 bg-surface-100  ">{{ group.spans.length }}</group-span-count>
            <span @click.stop="handleRemoveGroup(group)">
              <img
                style="height:18px;width:18px;filter: brightness(0) saturate(100%) invert(48%) sepia(72%) saturate(4640%) hue-rotate(337deg) brightness(98%) contrast(91%);"
                src="../../../public/icons/icons-svg/icons-svg/trash-icon.svg"
                alt="Trash Icon">
            </span>

            <!-- DELETE GROUP DIALOG  -->
            <Dialog
              :visible="!!groupDeleted"
              header="Confirmation de suppression"
              @update:visible="(value) => { if (!value) groupDeleted = null }"
            >
              <delete-group-wrapper class="flex flex-col gap-6">
                <delete-group-content class="flex items-center gap-4">
                  <delete-group-icon>
                    <span
                      style="filter: brightness(0) saturate(100%) invert(48%) sepia(72%) saturate(4640%) hue-rotate(337deg) brightness(98%) contrast(91%);"
                      class="pi pi-exclamation-triangle text-6xl"/>
                  </delete-group-icon>
                  <delete-group-text class="flex flex-col w-[440px]">
                    <b>Etes-vous sûr de vouloir supprimer ce groupe ?</b>
                    <span class="text-error_state">{{groupDeleted.label }}</span>
                  </delete-group-text>
                </delete-group-content>
                <delete-group-footer class="flex flex-row justify-end gap-2">
                  <Button outlined severity="primary" icon="pi pi-times" :disabled="isReadMode" el="Annuler" @click="handleCancelRemoveGroup()" />
                  <Button label="Confirmer" icon="pi pi-check" @click=" handleRemoveGroup() " />
                </delete-group-footer>
              </delete-group-wrapper>
            </Dialog>

          </group-wrapper>
      </div>
    </div>
  </div>

</template>

<script src="./molecule-span-control-panel-component.ts"></script>

<style scoped >
.hover-span:hover, .expand-type:hover .hover-span {
  width: var(--computed-width) !important
}
virtual-span-preview{
  flex: 0 1 0%;
  height: 0px;
  display: none
  }

role-dropzone:hover virtual-span-preview  {
  flex-grow: 1;
  height: auto;
  display: flex;
  opacity: 50%
}
virtual-span-preview:hover{
 opacity: 100% !important
}

.span-tag:hover span {
  opacity: 100%;
}

.span-tag span {
  opacity: 20%;
}
</style>

