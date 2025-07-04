<template>
  <div class="bg-white max-w-full w-full p-4" >
    <div>
      <b class="text-xl">Spans</b>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div v-for="span in spanOnlyArray"
          :key="span.id" draggable="true" :class="['p-2 grid  gap-1 hover:bg-primary-50 cursor-pointer overflow-hidden transition-all',
          'grid-cols-[80px_1fr_0fr]',
          'hover:grid-cols-[minmax(80px,_min-content)_1fr_0fr]' ,
          span.label ? 'grid-cols-[80px_1fr_minmax(100px,_50%)] hover:grid-cols-[minmax(80px,_min-content)_1fr_minmax(50%,100px)]' : ''
        ] "
        @dragstart="event=>event.dataTransfer.setData('span', span.id)">
        <span
:style="{backgroundColor : computeColorByLabel(spanTypeOptions.map(opt=>opt.label),[span?.type.label]).hex +'66', borderColor:computeColorByLabel(spanTypeOptions.map(opt=>opt.label),[span?.type.label]).hex }"
        class="p-1 rounded border-4 inline-block text-xs/3 h-fit truncate text-center " >
          {{span?.type.label}}
        </span>
        <span class="self-center font-semibold truncate">{{span.label ?? extractTextFromSpanNodes(span.nodes)}}</span>
        <span v-if="span.label" class="text-subtitle truncate self-center  "  >
          {{extractTextFromSpanNodes(span.nodes)}}
        </span>
      </div>
    </div>
    <div>
      <b class="text-xl">Groupe Courrant</b>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div :class="{' grid  transition-all duration-300 overflow-hidden': true}" :style="{'grid-template-rows' : groupIsSelected ? '1fr': '0fr'}" >
        <div :style="{'min-height' : 0}" >
          <div :class="`${computeColorByLabel(spanGroupTypeOptions.map(opt=>opt.label),[selectedGroup?.type.label]).full} ` + 'w-fit'"> {{selectedGroup?.label ?? selectedGroup?.type.label}}</div>
          <span class="font-semibold">Roles</span>
          <div class="grid" style="grid-template-columns: repeat(auto-fit,minmax(150px, 1fr));">
            <div v-for="role in selectedGroup?.type.roles" class="p-2  border-surface-200   text-center">
              {{ role }}
              <ScrollPanel class=" h-[100px] border border-surface-400 rounded " >
                <div
  class="flex flex-col text-start gap-1 h-full w-full "
                  @drop="dropSpan($event,selectedGroup,role)" @dragover="event=>event.preventDefault()" @dragenter="previewSpanDrop" @dragleave="unpreviewSpanDrop">
                  <span v-for="span in selectedGroup?.spans.filter(span => span.role == role )" :key="span.id" :style="{ backgroundColor : computeColorByLabel(spanTypeOptions.map(opt=>opt.label),[spanArray[span.spanId].type.label]).hex + '66'}" class=" truncate mr-2 max-w-full w-fit rounded  ">{{extractTextFromSpanNodes(spanArray[span.spanId].nodes)}}</span>
                </div>
              </ScrollPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <category-header class="flex flex-row justify-between items-center">
        <b class="text-xl">Liste des groupes</b>
        <Button icon="pi pi-plus" icon-pos="right" label="Ajouter" rounded outlined size="small" class="self-end " @click="emit('handleNewGroup',$event)" />
      </category-header>
      <Divider :pt="{ root:{ style: 'margin-top : 10px; margin-bottom: 10px' } }" />
      <div class="flex flex-col gap-3">
      <div
v-for="group in groupArray" :class="{' hover:bg-primary-100 cursor-pointer p-2 rounded-md flex items-center justify-between' :true, 'border-2 bg-surface-100 border-title font-semibold' : newFocus== group.id}"
            @click="newFocus = group.id" >
            {{ group.label ?? group.type.label }}
            <span class="  text-center rounded-full p-0 text-xl leading-10  h-10 w-10 bg-surface-100  ">{{ group.spans.length }}</span>
          </div>
      </div>
    </div>
  </div>

</template>

<script src="./span-control-panel-component.ts"></script>
