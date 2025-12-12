<template>
  <draggable
      :modelValue="blocks"
      @update:modelValue="blocks = $event"
      handle=".drag-handle"
      item-key="id"
      animation="200"
      class="max-w-full w-full h-fit"
  >
    <template #item="{ element }" class="max-w-full w-full h-fit">
      <div :key="element.id" class="max-w-full w-full h-fit">
        <!-- Bloc "span" -->
        <div v-if="element.key === 'span'" class="draggable-section">
          <div class="flex flex-col gap-2">
              <Panel toggleable v-model:collapased="panelCollapseController.spanList">
              <template #toggleicon={collapsed}>
                <Button :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" severity="secondary" rounded text />
              </template>
              <template #header>
                  <panel-span-header class="flex items-center w-full">
                    <div class="drag-handle pr-3">:::</div>
                    <b class="text-xl">Spans</b>
                    <span-filter-wrapper class="flex items-center ml-auto gap-4">
                      <span-link-filter v-if="isForResearch" class="flex items-center gap-2" @click.stop>
                        <span>Assignation</span>
                        <Select
                            v-model="spanLinkFilter"
                            placeholder="Tous"
                            :show-clear="true"
                            option-label="label"
                            :options="[{label:'Aucun',value:'unlinked'},{label:'Groupe',value:'linked'}]"
                        />
                      </span-link-filter>
                      <span-filter v-if="mainPluginId" class="flex items-center gap-2 pr-3" @click.stop>
                        {{ mainPluginName?.charAt(0).toUpperCase() + mainPluginName?.slice(1) }}
                        <Select
                            v-model="spanFilter"
                            placeholder="Tous"
                            :show-clear="true"
                            :options="createdPluginOptionsList"
                            option-label="label"
                            emptyMessage="Tous"
                        />
                      </span-filter>
                    </span-filter-wrapper>
                  </panel-span-header>
                </template>
                <span-wrapper>
                  <ScrollPanel
                      :style="{ maxHeight: '333px', height: spanOnlyArray.length < 8 ? 'auto' : '340px' }"
                      class="overflow-auto"
                      :dt="{
                      bar: { background: 'var(--primary-color)', size: '5px' },
                      barY: { style: 'right: -5px;' }
                    }"
                  >
                    <span-content-wrapper
                        v-for="(span,index) in spanOnlyArray"
                        :key="span.id"
                        draggable="true"
                        class="flex p-2 flex-row items-center gap-1 hover:bg-primary-50 cursor-pointer transition-all duration-300 expand-type"
                        @dragstart="event=>{
                        event.dataTransfer.setData('span', span.id)
                        event.dataTransfer.setDragImage([...event.target.children][1],10,10)
                      }"
                    >
                      <span-number class="font-bold self-center px-2">{{index+1}}</span-number>
                      <AtomSpanTag
                          :plugin-id="mainPluginId"
                          :plugin-value="span?.plugins?.[mainPluginIndex]"
                          :text="span?.plugins?.[mainPluginIndex]?.map(value=>value?.label).join(', ')"
                          expandable
                          @contextmenu="openSpanMenu($event, span)"
                      />
                      <span class="self-center font-semibold flex-1 overflow-hidden truncate">
                      <span class="inline-block max-w-full truncate"
                            v-tooltip.right="{
                            value: span?.label ?? extractTextFromSpanNodes(span?.nodes),
                            showDelay: 300,
                            appendTo: 'body'}">
                        {{span?.label ?? extractTextFromSpanNodes(span?.nodes)}}
                      </span>
                      </span>
                        <span class="text-subtitle text-end italic truncate grow max-w-[40%] overflow-hidden">
                        <span
                            v-if="span?.label"
                            v-tooltip.left="{
                              value: extractTextFromSpanNodes(span?.nodes)
                              , showDelay: 300,
                               appendTo: 'body'}">
                          {{extractTextFromSpanNodes(span?.nodes)}}
                        </span>
                        </span>
                      </span-content-wrapper>
                      <ContextMenu v-if="isAnnotationEditable" ref="spanControlPanelMenu" :model="contextControlPanelMenuOptions"  />
                    </ScrollPanel>
                  </span-wrapper>
              </Panel>
          </div>
        </div>

        <!-- Bloc "currentGroup" -->
        <div v-if="element.key === 'currentGroup' && isForResearch && mainGroupPluginId" class="draggable-section">
          <div class="py-2">
            <Panel toggleable v-model:collapsed="panelCollapseController.currentGroup" >
              <template #toggleicon={collapsed}>
                <Button :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" severity="secondary" rounded text />
              </template>
              <template #header>
                <div class="flex items-center w-full h-7">
                  <group-title-wrapper class="flex items-center gap-3">
                    <div class="drag-handle pr-3">:::</div>
                    <b class="text-xl">Groupe Courant</b>
                    <AtomSpanTag class="text-xl justify-content-end ml-auto" v-if="groupIsSelected"
                      :plugin-id="mainGroupPluginId" :plugin-value="selectedGroup?.plugins[mainGroupPluginIndex]"
                      :text="selectedGroup?.plugins[mainGroupPluginIndex]?.[0]?.label" />
                  </group-title-wrapper>
                  <layout-button-wrapper v-if="groupIsSelected" class="flex gap-sm ml-auto">

                      <span-none-content
                          draggable="true"
                          class="flex flex-row items-center gap-1 hover:bg-primary-50 cursor-pointer transition-all duration-300 expand-type"
                          @dragstart="event=>{
                      event.dataTransfer.setData('span', spanNone.id)
                      event.dataTransfer.setDragImage([...event.target.children][1],10,10)
                    }"
                      >
                        <AtomSpanTag
                            :plugin-id="mainPluginId"
                            :plugin-value="spanNone?.plugins?.[mainPluginIndex]"
                            :text="spanNone?.plugins?.[mainPluginIndex]?.map(value=>value?.label).join(', ')"
                            expandable
                        />
                        <span></span>
                      </span-none-content>

                    <span
                      :class="['pi pi-th-large text-2xl cursor-pointer pt-1', layout == 'grid' ? 'opacity-100' : 'opacity-50']"
                      @click.stop="switchGroupLayout('grid')"></span>
                    <span
                      :class="['pi pi-list text-2xl cursor-pointer pt-1', layout == 'list' ? 'opacity-100' : 'opacity-50']"
                      @click.stop="switchGroupLayout('list')"></span>
                    <div @click.stop="dialogVirtualSpan = true" class="flex items-center gap-1 cursor-pointer">
                      <span class="pi pi-plus-circle text-xl"></span>Span virtuel
                    </div>
                  </layout-button-wrapper>
                </div>
              </template>
              <div :class="{ 'grid transition-all duration-300 overflow-hidden': true }"
                :style="{ 'grid-template-rows': groupIsSelected ? '1fr' : '0fr' }">
                <selected-group-content v-show="selectedGroup" :style="{ 'min-height': 0 }">
                  <role-wrapper class="grid" :style="`grid-template-columns: ${groupLayoutSytle};`">
                    <div v-for="category in selectedGroup?.plugins[mainGroupPluginIndex]?.[0].categories"
                      :key="category" class="p-2 border-surface-200 text-center min-w-0 flex flex-col gap-3">
                      <role-title-wrapper class="flex justify-center relative">
                        <role-span-title class="text-center font-bold">{{ category.label }}</role-span-title>
                      </role-title-wrapper>
                      <ScrollPanel class="h-[150px] border-2 border-dashed border-surface-400 rounded-md min-w-0">
                        <role-dropzone
                          class="flex flex-col text-start min-h-full w-full gap-[10px] p-[10px] bg-secondary-color min-w-0 relative"
                          @drop="dropSpan($event, selectedGroup, category)" @dragover="event => event.preventDefault()"
                          @dragenter="previewSpanDrop" @dragleave="unpreviewSpanDrop">
                          <group-linked-span
                            v-for="span in selectedGroup?.spans.filter(span => isEqual(span.role, category)).sort((a, b) => unixToTimestamp(spanArray[a.spanId]?.tcin) - unixToTimestamp(spanArray[b.spanId]?.tcin))"
                            :key="span" class="flex justify-between items-center max-w-full span-tag min-w-0">
                            <AtomSpanTag :plugin-id="mainPluginId"
                              :plugin-value="spanArray[span.spanId]?.plugins?.[mainPluginIndex]"
                              v-tooltip.top="{
                              value: spanArray[span.spanId]?.label || extractTextFromSpanNodes(spanArray[span.spanId]?.nodes) || spanArray[span.spanId]?.plugins?.[mainPluginIndex]?.map(value=>value.label).join(', ') || 'Aucun'
                              ,
                              showDelay: 300,
                              appendTo: 'body'}"
                              :text="spanArray[span.spanId]?.label || extractTextFromSpanNodes(spanArray[span.spanId]?.nodes) || spanArray[span.spanId]?.plugins?.[mainPluginIndex]?.map(value => value.label).join(', ')" />
                            <span class="pi pi-trash hover:bg-disabled rounded-full p-1"
                              @click="unlinkSpan(span, selectedGroup)" />
                          </group-linked-span>
                        </role-dropzone>
                      </ScrollPanel>
                    </div>
                  </role-wrapper>
                </selected-group-content>
              </div>
            </Panel>
          </div>
        </div>

        <!-- Bloc "groupsList" -->
        <div v-if="element.key === 'groupsList' && isForResearch && mainGroupPluginId" class="draggable-section">
          <div class="flex flex-col">
              <Panel toggleable v-model:collapsed="panelCollapseController.groupList">
              <template #toggleicon={collapsed}>
                <Button :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" severity="secondary" rounded text />
              </template>
                <template #header>
                  <category-header class="flex flex-row items-center w-full">
                    <div class="drag-handle pr-3">:::</div>
                    <b class="text-xl">Liste des groupes</b>
                    <group-filter-wrapper class="flex items-center gap-xl ml-auto pr-3">
                      <group-filled-filter class="flex items-center gap-sm" @click.stop>
                        <span>Rôle</span>
                        <Select
                            v-model="groupFilledFilter"
                            placeholder="Tous"
                            :show-clear="true"
                            :options="[{label:'Complet',value:'filled'},{label:'Incomplet',value:'unfilled'}]"
                            option-label="label"
                        />
                      </group-filled-filter>
                      <group-filter v-if="mainGroupPluginId" class="flex items-center gap-2" @click.stop>
                        {{ mainGroupPluginName?.charAt(0).toUpperCase() + mainGroupPluginName?.slice(1) }}
                        <Select
                            v-model="groupFilter"
                            placeholder="Tous"
                            :show-clear="true"
                            :options="pluginOptionsList?.find(p=>p.id==mainGroupPluginId)?.data"
                            option-label="label"
                        />
                      </group-filter>
                      <Button
                          icon="pi pi-plus"
                          icon-pos="right"
                          :disabled="!isAnnotationEditable"
                          label="Ajouter"
                          rounded
                          outlined
                          size="small"
                          class="self-end"
                          @click.stop="emit('handleNewGroup',$event)"
                      />
                    </group-filter-wrapper>
                  </category-header>
                </template>
                <div class="flex flex-col gap-3">
                  <group-wrapper
                      :key="group.id"
                      v-for="(group,index) in groupArray"
                      :class="{'hover:bg-primary-100 cursor-pointer p-2 rounded-md flex items-center gap-2': true, 'border-2 bg-surface-100 border-title font-semibold': newFocus== group.id}"
                      @click="handleGroupClick(group.id)"
                  >
                    <group-number class="font-bold self-center px-2 h-fit">{{index+1}}</group-number>
                    <group-label class="grow line-clamp-1">{{ group?.label || group.spans.filter(o=>o?.role?.label == whichCategoryTriggerRename(group)).map(o=>spanOnlyArray.find(span=>span.id == o.spanId)).sort((a,b) => a.tcin - b.tcin)[0]?.label || group?.plugins[mainGroupPluginIndex]?.[0]?.label }}</group-label>
                    <group-span-count class="text-center rounded-full p-0 text-xl leading-10 h-10 w-10 bg-surface-100 shrink-0">{{ group.spans.length }}</group-span-count>
                    <span class="shrink-0" @click.stop="handleRemoveGroup(group)">
                      <img
                          style="height:18px;width:18px;filter: brightness(0) saturate(100%) invert(48%) sepia(72%) saturate(4640%) hue-rotate(337deg) brightness(98%) contrast(91%);"
                          src="../../../public/icons/icons-svg/icons-svg/trash-icon.svg"
                          alt="Trash Icon"
                      >
                    </span>
                  </group-wrapper>

                  <!-- Dialogs ici, inchangés -->
                  <!-- DELETE GROUP DIALOG -->
                  <Dialog
                      v-model:visible="deleteDialogVisible"
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
                          <span class="text-error_state">{{groupDeleted?.label }}</span>
                        </delete-group-text>
                      </delete-group-content>
                      <delete-group-footer class="flex flex-row justify-end gap-2">
                        <Button outlined severity="primary" icon="pi pi-times" :disabled="!isAnnotationEditable" label="Annuler" @click="handleCancelRemoveGroup()" />
                        <Button label="Confirmer" icon="pi pi-check" @click=" handleRemoveGroup() " />
                      </delete-group-footer>
                    </delete-group-wrapper>
                  </Dialog>

                  <!-- ADD VIRTUAL SPAN DIALOG -->
                  <Dialog
                      :visible="!!dialogVirtualSpan"
                      header="Span : création d’un span virtuel"
                      @update:visible="()=>dialogVirtualSpan = false"
                      @after-hide="()=> virtualSpanLabel = ''"
                  >
                    <div class=" grid grid-cols-[100px_auto] items-center gap-3 gap-y-5 w-[650px]">
                      <b class=" text-right ">Rôle</b>
                      <div class="flex flex-wrap gap-4  ">
                        <div class=" w-full flex gap-3 items-center " >
                          <Button
                              v-for="category in selectedGroup?.plugins[mainGroupPluginIndex][0].categories"
                              :key="category.label"
                              class="h-[33px] rounded-[6px] "
                              :outlined="!isEqual(category,dialogVirtualSpan)"
                              :label="category.label"
                              @click="()=>dialogVirtualSpan = category"
                          />
                        </div>
                      </div>
                      <b class="text-right" > Label </b>
                      <InputText
                          v-model="virtualSpanLabel"
                          placeholder="Entrez le nom du span virtuel"
                          class="w-[215px]"
                      />
                    </div>
                    <div class="flex flex-row justify-end gap-2">
                      <Button outlined severity="contrast" icon="pi pi-times" label="Annuler" @click="()=>dialogVirtualSpan = false" />
                      <Button :disabled="!dialogVirtualSpan.label || !virtualSpanLabel"  label="Confirmer" icon="pi pi-check" @click="createVirtualSpan()" />
                    </div>
                  </Dialog>

                  <!-- UNAUTHORIZED SPAN DIALOG -->
                  <Dialog
                      :visible="!!unauthorizedSpanDropped"
                      header="L'élément que vous essayé d’insérer n’est pas autorisé
              car son type est inadéquat."
                      @update:visible="(value) => { if (!value) unauthorizedSpanDropped = null }"
                  >
                    <div class="flex items-start gap-2 text-gray-800">
              <span
                  class="pi pi-exclamation-triangle text-red-500 text-2xl mt-1"
              ></span>
                      <div>
                        <b>Vous pouvez uniquement insérer des éléments de type :</b>
                        <div class="mt-1 ml-6 space-y-1">
                          <div v-for="(item, index) in authorizedGroupList" :key="index" class="flex items-start">
                            <span class="mr-2">•</span>
                            <span>{{ item }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </Panel>
          </div>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script src="./molecule-span-control-panel-component.ts">
</script>

<style scoped >
.hover-span:hover, .expand-type:hover .hover-span {
  width: var(--computed-width) !important
}
virtual-span-preview{
  height: 0px;
  display: none
  }

role-title-wrapper:hover virtual-span-preview  {
  height: auto;
  display: block;
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

.draggable-section {
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 8px;
  background: white;
  margin-bottom: 12px;
}

.drag-handle {
  cursor: grab;
  font-size: 18px;
  margin-bottom: 8px;
  user-select: none;
}
.drag-handle:active {
  cursor: grabbing;
}
</style>
