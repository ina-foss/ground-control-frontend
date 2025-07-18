<template>
  <Dialog v-model:visible="visible" modal :header="modalHeader" @after-hide="onClose" >
    <div class="w-[500px] flex flex-col gap-2  " >
      <context-wrapper v-if="!showContext" class="border-dashed border-2 rounded border-subtitle px-6 py-4 transition-all duration-300  ">
      <context-header class="inline-flex w-full items-center justify-between pb-3">
        <span class="font-semibold  ">Contexte</span>
        <context-button-wrapper class="inline-flex gap-4 justify-around items-center">
          <span
              :class="['pi pi-minus rounded-full  border p-1 text-[10px]/3 font-bold   ',
            !expandedContext ? 'text-disabled  border-disabled' : 'cursor-pointer border-black hover:bg-primary-50'
          ]"
            @click="shrinkContext"/>
          <span
              :class="['pi pi-plus rounded-full  border p-1 text-[10px]/3 font-bold   ',
            expandedContext ? 'text-disabled  border-disabled' : 'cursor-pointer border-black hover:bg-primary-50'
          ]"
            @click="expandContext()"/>
        </context-button-wrapper>
      </context-header>
      <div v-if="!groupDisplay" :class="['w-full  items-center  gap-1 text-sm/6 ', expandedContext ? 'inline'  : 'flex']"  >
          <span :class="[!expandedContext ?  '  truncate  ' : '  text-justify']" :style="{'direction': expandedContext ? 'ltr' : 'rtl'}"> {{ prevNodes.map(n=>n.firstChild.nodeValue).join(' ') + " " }}</span>
          <span :class="[ 'highlight-text max-w-full text-justify  ', expandedContext ? '' : 'truncate' ]" style="flex: 1 0 min-content;" >
            {{ nodes?.map(node=>Array.from(node.childNodes).filter(child=>child.nodeType == 3 )[0].nodeValue).join(' ')}}
          </span>
         <span :class="[!expandedContext ?  '  truncate ' : 'text-justify ']"> {{ " " + nextNodes.map(n=>n.firstChild.nodeValue).join(' ') }}</span>
      </div>
    </context-wrapper>

      <plugin-wrapper v-if="!deleteLayout" class="flex flex-col gap-2">
        <label > Type de {{groupDisplay ? 'groupe':'span'}}  </label>
        <Select v-model="labelSelected" :options="groupDisplay ? spanGroupTypeOptions : spanTypeOptions" filter option-label="label"   />
        <div class="grid gap-1 " style="grid-template-columns: repeat(auto-fit,minmax(100px,1fr))" >
          <Button v-for="option in groupDisplay ? spanGroupTypeOptions : spanTypeOptions " class="!text-xs " size="small" :outlined="labelSelected != option" :label="option.label"  @click="()=>labelSelected= option"/>
        </div>
        <label > Label libre  </label>
        <InputText v-model="freeLabel" />
        <label > Plugin  </label>
        <InputText />

      </plugin-wrapper>

      <delete-wrapper v-else class="text-center py-8">
        Souhaitez-vous vraiment supprimer ce span ?
      </delete-wrapper>

        <div class="flex flex-row justify-between">
          <Button text severity="secondary" icon="pi pi-times" label="Annuler" @click=" close()" />
          <Button label="Confirmer" icon="pi pi-check" @click=" handleConfirmationButton() " />
        </div>

    </div>

  </Dialog>
</template>

<script src="./atom-span-form-component.ts"></script>

<style scoped>
  .highlight-text {
    background: linear-gradient(to left, var(--extra-1) 50%, transparent 0);
    background-size: 200% 100%;
    background-position: right;
  }

  @keyframes highlight {
    100% {
      background-position: left;
    };
  }
</style>
