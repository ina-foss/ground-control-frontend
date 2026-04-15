<template>
  <draggable
      :model-value="blocks"
      handle=".drag-handle"
      item-key="id"
      animation="200"
      class="max-w-full w-full h-fit"
      @update:model-value="blocks = $event"
  >
    <template #item="{ element }" class="max-w-full w-full h-fit">
      <div :key="element.id" class="max-w-full w-full h-fit">
        <!-- Bloc "span" -->
        <div v-if="element.key === 'span'" class="draggable-section">
          <div class="flex flex-col gap-2">
              <Panel v-model:collapsed="panelCollapseController.spanList" toggleable class="[&_.p-panel-header]:!bg-transparent [&_.p-panel-content]:!p-0">
              <template #toggleicon={collapsed}>
                <Button :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" severity="secondary" rounded text />
              </template>
              <template #header>
                  <panel-span-header class="flex items-center w-full">
                    <div class="drag-handle pr-3 hover:text-hover">:::</div>
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
                            empty-message="Tous"
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
                        barY: { style: 'right: -5px;' }
                      }"
                    >
                      <span-content-wrapper
                          v-for="(span,index) in visibleSpanOnlyArray"
                          :key="span.id"
                          draggable="true"
                          class="flex py-3 flex-row items-center gap-1 hover:bg-primary-50 cursor-pointer transition-all duration-300 expand-type"
                          @dragstart="event=>{
                          event.dataTransfer.setData('span', span.id)
                          event.dataTransfer.setDragImage([...event.target.children][1],10,10)
                        }"
                          @click="onSpanClick(span)"
                      >
                        <span-number class="font-bold self-center px-2">{{index+1}}</span-number>
                        <AtomSpanTag
                            :plugin-id="mainPluginId ?? 0"
                            :plugin-value="span?.plugins?.[mainPluginIndex]?? null"
                            :text="span?.plugins?.[mainPluginIndex]?.map(value=>value?.label).join(', ')??'Span'"
                            expandable
                            @contextmenu="openSpanMenu($event, span)"
                        />
                        <span class="self-center flex-1 overflow-hidden truncate">
                        <span
                              v-tooltip.right="{
                              value: span?.label ?? extractTextFromSpanNodes(span?.nodes),
                              showDelay: 300,
                              appendTo: 'body'}"
                              class="inline-block max-w-full truncate pl-2">
                          {{capitalizeFirstLetter(span?.label ?? extractTextFromSpanNodes(span?.nodes))}}
                        </span>
                        </span>
                        <span class="text-subtitle text-end italic truncate grow max-w-[40%] overflow-hidden pr-2">
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
          <div>
            <Panel v-model:collapsed="panelCollapseController.currentGroup" toggleable class="[&_.p-panel-header]:!bg-transparent" >
              <template #toggleicon={collapsed}>
                <Button :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" severity="secondary" rounded text />
              </template>
              <template #header>
                <div class="flex items-center w-full h-7">
                  <group-title-wrapper class="flex items-center gap-3">
                    <div class="drag-handle pr-3 hover:text-hover">:::</div>
                    <b class="text-xl">Groupe Courant</b>
                    <AtomSpanTag
                      v-if="groupIsSelected" class="text-xl justify-content-end ml-auto"
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
                        <span/>
                      </span-none-content>

                    <span
                      :class="['pi pi-th-large text-2xl cursor-pointer pt-1', layout == 'grid' ? 'opacity-100' : 'opacity-50']"
                      @click.stop="switchGroupLayout('grid')"/>
                    <span
                      :class="['pi pi-list text-2xl cursor-pointer pt-1', layout == 'list' ? 'opacity-100' : 'opacity-50']"
                      @click.stop="switchGroupLayout('list')"/>
                    <div class="flex items-center gap-1 cursor-pointer" @click.stop="openVirtualSpanForm">

                      <img
                          src="/icons/icons-svg/icons-svg/virtual-icon.svg"
                          alt="Virtual Icon"
                          class="btn-svg-icon icon-color"
                      />
                        <b>{{t('spanForm.virtualSpan.buttonTitle')}}</b>
                    </div>
                  </layout-button-wrapper>
                </div>
              </template>
              <div
                :class="{ 'grid transition-all duration-300 overflow-hidden': true }"
                :style="{ 'grid-template-rows': groupIsSelected ? '1fr' : '0fr' }">
                <selected-group-content v-show="selectedGroup" :style="{ 'min-height': 0 }">
                  <role-wrapper v-if="selectedGroup?.plugins[mainGroupPluginIndex]?.[0]?.categories?.length" class="grid" :style="`grid-template-columns: ${groupLayoutSytle};`">
                    <div v-for="category in selectedGroup?.plugins[mainGroupPluginIndex]?.[0].categories"
                      :key="category" class="p-2 border-surface-200  text-center min-w-0 flex flex-col gap-3">
                      <div class="flex flex-col gap-3 justify-center relative bg-secondary-color context-wrapper">
                      <role-title-wrapper class="flex justify-center relative  pt-3">
                        <role-span-title class="text-center font-bold">{{ category.label }}</role-span-title>
                      </role-title-wrapper>
                      <ScrollPanel class="h-[150px] min-w-0">
                        <role-dropzone
                          class="flex flex-col text-start min-h-full w-full gap-[10px] p-[10px]  min-w-0 relative"
                          @drop="dropSpan($event, selectedGroup, category)" @dragover="event => event.preventDefault()"
                          @dragenter="previewSpanDrop" @dragleave="unpreviewSpanDrop">
                          <group-linked-span
                            v-for="span in selectedGroup?.spans.filter(span => isEqual(span.role, category)).sort((a, b) => unixToTimestamp(spanArray[a.spanId]?.tcin) - unixToTimestamp(spanArray[b.spanId]?.tcin))"
                            :key="span?.spanId" class="flex justify-between items-center max-w-full span-tag min-w-0">
                            <AtomSpanTag
                              v-tooltip.top="{
                              value: spanArray[span.spanId]?.label || extractTextFromSpanNodes(spanArray[span.spanId]?.nodes) || spanArray[span.spanId]?.plugins?.[mainPluginIndex]?.map(value=>value.label).join(', ') || 'Aucun'
                              ,
                              showDelay: 300,
                              appendTo: 'body'}"
                              :plugin-id="mainPluginId"
                              :plugin-value="spanArray[span.spanId]?.plugins?.[mainPluginIndex]"
                              :text="spanArray[span.spanId]?.label || extractTextFromSpanNodes(spanArray[span.spanId]?.nodes) || spanArray[span.spanId]?.plugins?.[mainPluginIndex]?.map(value => value.label).join(', ')"
                                         @contextmenu="openVirtualSpanMenu($event, span)"
                                         @click="onSpanClick(spanArray[span.spanId])"/>
                            <span
                              class="pi pi-trash hover:bg-disabled rounded-full p-1"
                              @click="unlinkSpan(span, selectedGroup)" />
                          </group-linked-span>
                        </role-dropzone>
                      </ScrollPanel>
                    </div>
                    </div>
                  </role-wrapper>
                  <role-error-container v-else class="flex justify-center" >
                    <Message class="w-fit" severity="warn" icon="pi pi-exclamation-triangle">{{t('spanControlPanel.emptyGroupMessage')}}</Message>
                  </role-error-container>
                </selected-group-content>
              </div>
            </Panel>
          </div>
        </div>

        <!-- Bloc "groupsList" -->
        <div v-if="element.key === 'groupsList' && isForResearch && mainGroupPluginId" class="draggable-section">
          <div class="flex flex-col">
              <Panel v-model:collapsed="panelCollapseController.groupList" toggleable class="[&_.p-panel-header]:!bg-transparent">
              <template #toggleicon={collapsed}>
                <Button :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" severity="secondary" rounded text />
              </template>
                <template #header>
                  <category-header class="flex flex-row items-center w-full">
                    <div class="drag-handle pr-3 hover:text-hover">:::</div>
                    <b class="text-xl">Liste des groupes</b>
                    <group-filtergroup-filter-wrapper class="flex items-center gap-xl ml-auto pr-3">
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
                      <div :disabled="!isAnnotationEditable" class="flex items-center gap-1 cursor-pointer" @click.stop="openGroupForm">
                        <span class="pi pi-plus-circle pr-2" style="font-size: 1.5rem;"/><b>{{t('actions.add')}}</b>
                      </div>
                    </group-filtergroup-filter-wrapper>
                  </category-header>
                </template>
                <div class="flex flex-col gap-3">
                  <group-wrapper
                      v-for="(group,index) in sortedVisibleGroupArray"
                      :key="group.id"
                      :class="{'hover:bg-primary-100 cursor-pointer p-2 rounded-md flex items-center gap-2': true, 'border-2 bg-surface-100 border-title font-semibold': newFocus== group.id}"
                      @click="handleGroupClick(group.id)"
                  >
                    <group-number class="font-bold self-center px-2 h-fit">{{sortedVisibleGroupArray.length - index}}</group-number>
                    <group-label class="grow line-clamp-1">{{ getGroupLabel(group) || t('spanControlPanel.untitledGroupErrorMessage')  }}</group-label>
                    <group-span-count class="text-center rounded-full p-0 text-xl leading-10 h-10 w-10 bg-surface-100 shrink-0">{{ group.spans.length }}</group-span-count>
                    <span class="shrink-0" @click.stop="handleRemoveGroup(group)">
                      <img
                          style="height:18px;width:18px;filter: brightness(0) saturate(100%) invert(48%) sepia(72%) saturate(4640%) hue-rotate(337deg) brightness(98%) contrast(91%);"
                          src="/icons/icons-svg/icons-svg/trashIcon.svg"
                          alt="Trash Icon"
                      >
                    </span>
                  </group-wrapper>

                  <!-- Dialogs ici, inchangés -->
                  <!-- DELETE GROUP DIALOG -->
                  <MoleculeDialogConfirm
                      v-model:visible="deleteDialogVisible"
                      :title="t('spanForm.deleteGroupConfirmTitle')"
                      :message="t('spanForm.deleteGroupConfirmMessage')"
                      :with-exclamation="true"
                      :cancel-button="{
                        label: t('actions.cancel'),
                        icon: 'pi pi-times',
                        severity: 'primary',
                        outlined: true,
                      }"
                      :confirm-button="{
                        label: t('actions.confirm'),
                        icon: 'pi pi-check',
                        severity: 'primary',
                      }"
                      @update:visible="(value) => { if (!value) groupDeleted = null }"
                      @cancel="handleCancelRemoveGroup"
                      @confirm="handleRemoveGroup"
                  />

                  <!-- ADD VIRTUAL SPAN DIALOG-->
                  <AtomSpanForm ref="spanFormRef" @new-group="focusGroup($event) & showPanel('currentGroup','groupList') " />
                  <!-- UNAUTHORIZED SPAN DIALOG -->
                  <AtomDialogFilterGroup
:visible="!!unauthorizedSpanDropped"
                                         :authorized-type-list="authorizedGroupList"
                                         @update:visible="(value) => { if (!value) unauthorizedSpanDropped = null }"/>
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

<style >
.p-panel-content-wrapper {
   min-width: 0; /* prevent panel content to overflow */
}
</style>
