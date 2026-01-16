<template>
  <Dialog v-model:visible="visible" modal :header="modalHeader" @after-hide="onClose"  >
    <div class=" w-[700px] flex flex-col gap-6 " >
      <context-wrapper v-if="!showContext" class="flex flex-col border-dashed border-2 rounded border-subtitle p-5 transition-all duration-300 gap-2 bg-grey-50 ">
        <context-header class="inline-flex w-full items-center justify-between pb-3">
          <span class="font-semibold  ">  {{ t('spanForm.context') }} </span>
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
            <Message class="w-fit" severity="error" icon="pi pi-exclamation-triangle" >  {{ t('spanForm.selectValueError') }}</Message>
          </message-wrapper>
          <!--virtual span role-->
          <div v-if="isVirtualSpan" class=" grid grid-cols-[100px_auto] items-center gap-3 gap-y-5 w-[650px]">
            <b class=" text-right ">Rôle</b>
            <div class="flex flex-wrap gap-4  ">
              <div class=" w-full flex gap-3 items-center " >
                <Button
                    v-for="category in selectedGroupValue?.plugins[mainGroupPluginIndexValue][0].categories"
                    :key="category.label"
                    class="h-[33px] rounded-[6px] "
                    :outlined="!isEqual(category,virtualSpanCategory)"
                    :label="category.label"
                    @click="()=>virtualSpanCategory = category"
                />
              </div>
            </div>

          </div>
          <!--virtual span role-->
          <plugin-iterator v-for="(plugin,index) in tidiedPluginList[groupDisplay ? 'group_modal' : 'span_modal_left'  ]" class="flex flex-col gap-3 ">
            <div class=""   >
              <component :is="selectComponent(plugin).component" v-bind="selectComponent(plugin).props" :index="index" :textSpan="textSpan" v-model:plugin-value="pluginValues[readPluginValues(plugin)]" @update:plugin-value="pluginChangeValue(plugin,$event)" >
                <b :class="{'pt-2 text-right ': true , 'text-error': (plugin.display_config?.main_plugin || groupDisplay) && showErrorMessage }">{{ ( plugin?.display_config?.label || plugin?.name.charAt(0).toUpperCase() +  plugin?.name.slice(1) ) }} </b>
              </component>
            </div>
            <div class="" v-if="childPluginMap[readPluginValues(plugin)] != undefined " v-for="(child,childIndex) in childPluginMap[readPluginValues(plugin)]" :key="child.id">
                <component :is="selectComponent(child).component" v-bind="selectComponent(child).props" :index="childIndex" :textSpan="textSpan" v-model:pluginValue="pluginValues[readPluginValues(child)]">
                  <b class="text-right ">{{  child?.display_config?.label || child?.name.charAt(0).toUpperCase() + child?.name.slice(1)  }}</b>
                </component>
            </div>
          </plugin-iterator>

          <div v-if="!isForResearch" >
            <div v-if="pluginSelected">
              <div class=" grid grid-cols-[100px_auto] gap-3 gap-y-5"  v-if="nodesCount === 1">
                <b  class="pt-2 text-right "> {{t('spanForm.missingWordsLabel')}} </b>
                <InputNumber v-model="deletedNum" :placeholder="t('spanForm.missingWordsPlaceholder')" class="w-[250px]"/>
              </div>
              <label v-else class="block text-center text-red-500" >{{suppWarning}}</label>
            </div>
          </div>

          <div v-if="isForResearch" class="grid grid-cols-[100px_auto] gap-3 gap-y-5">
            <b class="pt-2 text-right">
              {{t('spanForm.correctedTerm')}}
            </b>
            <InputText
              v-model="defaultLabel"
              :placeholder="t('correctedTermPlaceholder')"
              class="w-[calc(100%-110px)]"
            />
          </div>
          <div
            v-if="showLabelInput && !isForResearch && getPluginList.length !==0"
            class="grid grid-cols-[100px_auto] gap-3 gap-y-5"
          >
            <b class="pt-2 text-right">
              {{labelTitle}}
            </b>

            <InputText
              v-model="defaultLabel"
              :placeholder="labelTitle"
              class="w-[calc(100%-110px)]"
            />

          </div>
        </main-plugins-wrapper>

      </plugin-wrapper>

      <delete-wrapper v-else class="text-center py-8">
        {{t('spanForm.deleteConfirm')}}
      </delete-wrapper>

      <div class="flex flex-row justify-end gap-2">
        <Button outlined severity="primary" icon="pi pi-times" :label="t('actions.cancel')" @click=" close()" />
        <Button   :disabled="isVirtualSpan && (!virtualSpanCategory ||  !defaultLabel) ||!isForResearch && childPluginMap &&  pluginSelected !== '' && (nodesCount > 1 || deletedNum === null || deletedNum === undefined || deletedNum === 0)"
                  :label="t('actions.confirm')" icon="pi pi-check" @click=" handleConfirmationButton() " />
      </div>

    </div>
    <!-- MODALE D'ERREUR SUPERPOSÉE -->

    <Dialog
      :visible="unauthorizedVirtualSpan"
      header="L'élément que vous essayé d’insérer n’est pas autorisé
              car son type est inadéquat."
      :baseZIndex="1100"
      :closable="true"
      :dismissableMask="false"
      @update:visible="v => unauthorizedVirtualSpan = false"
    >
      <div class="flex items-start gap-2 text-gray-800">
              <span
                class="pi pi-exclamation-triangle text-red-500 text-2xl mt-1"
              ></span>
        <div>
          <b>Vous pouvez uniquement insérer des éléments de type :</b>
          <ul class="mt-2 ml-6 list-disc">
            <li v-for="type in authorizedTypeList" :key="type">
              {{ type }}
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
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
