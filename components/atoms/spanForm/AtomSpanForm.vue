<template>
  <Dialog v-model:visible="visible" modal :header="modalHeader" @after-hide="onClose"  >
    <div class=" w-[700px] flex flex-col gap-6 " >
      <context-wrapper v-if="!showContext" class="flex flex-col border-dashed border-2 rounded border-subtitle p-5 transition-all duration-300 gap-2 bg-grey-50 ">
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
            <span :class="[ ' max-w-full text-justify rounded px-2 border-2 !border-[--extra-1]  ', expandedContext ? '' : 'truncate' ]" style="flex: 1 0 min-content; background-color: #86d4ff40 ;" >
            {{extractTextFromSpanNodes(nodes)}}
            </span>
          <span :class="[!expandedContext ?  '  truncate ' : 'text-justify ']"> {{ " " + nextNodes.map(n=>n.firstChild.nodeValue).join(' ') }}</span>
        </div>
    </context-wrapper>

      <plugin-wrapper v-if="!deleteLayout" class="flex flex-col gap-5  ">
        <main-plugins-wrapper class="flex flex-col gap-5  ">
          <message-wrapper v-if="showErrorMessage" class="flex justify-center">
            <Message class="w-fit" severity="error" icon="pi pi-exclamation-triangle" >Veuillez selectionner une valeur</Message>
          </message-wrapper>
          <plugin-iterator v-for="(plugin,index) in tidiedPluginList[groupDisplay ? 'group_modal' : 'span_modal_left'  ]" class="flex flex-col gap-3 ">
            <div class=""   >
              <component :is="selectComponent(plugin).component" v-bind="selectComponent(plugin).props" :index="index" :textSpan="textSpan" v-model:plugin-value="pluginValues[readPluginValues(plugin)]" @last-selected="onLastSelected" @update:plugin-value="pluginChangeValue(plugin,$event)" >
                <b :class="{'pt-2 text-right ': true , 'text-error': (plugin.display_config?.main_plugin || groupDisplay) && showErrorMessage }">{{ ( plugin?.display_config?.label || plugin?.name.charAt(0).toUpperCase() +  plugin?.name.slice(1) ) }} </b>
              </component>
            </div>
            <div class="" v-if="childPluginMap[readPluginValues(plugin)] != undefined " v-for="(child,childIndex) in childPluginMap[readPluginValues(plugin)]" :key="child.id">
                <component :is="selectComponent(child).component" v-bind="selectComponent(child).props" :index="childIndex" :textSpan="textSpan" v-model:pluginValue="pluginValues[readPluginValues(child)]" @last-selected="onLastSelected">
                  <b class="text-right ">{{  child?.display_config?.label || child?.name.charAt(0).toUpperCase() + child?.name.slice(1)  }}</b>
                </component>
            </div>
          </plugin-iterator>

          <div v-if="!isForResearch" >
            <div v-if="pluginSelected">
              <div class=" grid grid-cols-[100px_auto] gap-3 gap-y-5"  v-if="nodesCount === 2">
                <b  class="pt-2 text-right "> Nombre de mots supprimés   </b>
                <InputNumber v-model="deletedNum" placeholder="Entrez le nombre de mots manquants" class="w-[250px]"/>
              </div>
              <label v-else class="block text-center text-red-500" >{{suppWarning}}</label>
            </div>
          </div>

          <div class="grid grid-cols-[100px_auto] gap-3 gap-y-5">
                  <b class="pt-2 text-right" > Label </b>
                  <InputText
                      v-model="defaultLabel"
                      placeholder="Entrez un label personalisé"
                      class="w-[calc(100%-110px)]"
                      />
          </div>
        </main-plugins-wrapper>

      </plugin-wrapper>

      <delete-wrapper v-else class="text-center py-8">
        Souhaitez-vous vraiment supprimer ce span ?
      </delete-wrapper>

        <div class="flex flex-row justify-end gap-2">
          <Button outlined severity="primary" icon="pi pi-times" label="Annuler" @click=" close()" />
          <Button   :disabled="!isForResearch && childPluginMap &&  pluginSelected !== '' && (nodesCount > 2 || deletedNum === null || deletedNum === undefined || deletedNum === 0)"
                    label="Confirmer" icon="pi pi-check" @click=" handleConfirmationButton() " />
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
    }
  }
</style>
