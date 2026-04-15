<template>
  <Dialog v-model:visible="visible" modal :header="modalHeader" @after-hide="onClose"  >
    <div class=" w-[950px] flex flex-col gap-6 " >
      <context-wrapper v-if="!showContext" class="context-wrapper flex flex-col  p-5 transition-all duration-300 gap-2 bg-grey-50 "
>
        <context-header class="inline-flex w-full items-center justify-between pb-3">
          <span class="font-semibold  ">  {{ t('spanForm.context') }} </span>
          <context-button-wrapper class="inline-flex gap-4 justify-around items-center">
            <span
              :class="['pi pi-minus-circle',
              !expandedContext ? 'grey-500 border-grey-500  opacity-50' : 'cursor-pointer border-black hover:bg-primary-50'
            ]" style="font-size: 1.5rem;"
              @click="shrinkContext"/>
            <span
              :class="['pi pi-plus-circle',
              expandedContext ? 'grey-500 border-grey-500  opacity-50' : 'cursor-pointer border-black hover:bg-primary-50'
            ]" style="font-size: 1.5rem;"
              @click="expandContext()"/>
          </context-button-wrapper>
        </context-header>
        <div :class="['w-full  justify-center items-center  gap-1 text-sm/6 ', expandedContext ? 'inline'  : 'flex']"  >
          <span :class="[!expandedContext ?  ' truncate ' : '  text-justify']" :style="{'direction': expandedContext ? 'ltr' : 'rtl'}" style="flex: 0 1 content; min-width: 0px; " > {{ prevNodes.map(n=>n.firstChild?.nodeValue).join(' ') + " " }}</span>
          <span :class="[ ' max-w-full text-justify rounded px-2 border-2 !border-[--extra-1]  ', expandedContext ? '' : 'truncate' ]" style="flex: 0 0 content; background-color: #86d4ff40 ;" >
            {{extractTextFromSpanNodes(nodes)}}
            </span>
          <span :class="[!expandedContext ?  '  truncate ' : 'text-justify ']" style="flex: 0 1 content;min-width: 0px; "> {{ " " + nextNodes.map(n=>n.firstChild?.nodeValue).join(' ') }} </span>
        </div>
      </context-wrapper>

      <plugin-wrapper v-if="!deleteLayout" class="flex flex-col gap-5  ">
        <main-plugins-wrapper class="flex flex-col gap-5  ">
          <!--virtual span role-->
          <div v-if="isVirtual" class=" grid grid-cols-[100px_auto] items-center gap-3 gap-y-5 w-[650px]">
            <p :class="{'pt-2 text-right ': true , 'text-error': (!virtualSpanCategory) && showErrorMessage }">{{t('spanForm.virtualSpan.role')}}</p>
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
          <message-wrapper v-if="showErrorMessage" class="flex justify-center">
            <Message class="w-fit" severity="error" icon="pi pi-exclamation-triangle" >  {{ t('spanForm.selectValueError') }}</Message>
          </message-wrapper>
          <!--virtual span plugins-->
          <plugin-iterator v-for="(plugin,index) in tidiedPluginList[isGroup ? 'group_modal' : 'span_modal_left'  ]" class="flex flex-col gap-3 ">
            <div class=""   >
              <component :is="selectComponent(plugin).component" v-bind="selectComponent(plugin).props" v-model:plugin-value="pluginValues[readPluginValues(plugin)]" :index="index" :text-span="textSpan" @update:plugin-value="pluginChangeValue(plugin,$event)" >
                <p :class="{'pt-2 text-right ': true , 'text-error': (plugin.display_config?.main_plugin || isGroup) && showErrorMessage }">{{ ( plugin?.display_config?.label || plugin?.name.charAt(0).toUpperCase() +  plugin?.name.slice(1) ) }} </p>
              </component>
            </div>
            <div v-for="(child,childIndex) in childPluginMap[readPluginValues(plugin)]" v-if="childPluginMap[readPluginValues(plugin)] != undefined " :key="child.id" class="">
                <component :is="selectComponent(child).component" v-bind="selectComponent(child).props" v-model:plugin-value="pluginValues[readPluginValues(child)]" :index="childIndex" :text-span="textSpan">
                  <p class="text-right ">{{  child?.display_config?.label || child?.name.charAt(0).toUpperCase() + child?.name.slice(1)  }}</p>
                </component>
            </div>
          </plugin-iterator>

          <div v-if="!isForResearch" >
            <div v-if="pluginSelected">
              <div v-if="nodesCount === 1"  class=" grid grid-cols-[100px_auto] gap-3 gap-y-5">
                <p  :class="{'pt-2 text-right ': true , 'text-error': showErrorMessage }"> {{t('spanForm.missingWordsLabel')}} </p>
                <InputNumber v-model="deletedNum" :placeholder="t('spanForm.missingWordsPlaceholder')" class="w-[250px]" showButtons buttonLayout="stacked" :min="0" >
                  <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                  </template>
                  <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                  </template>
                </InputNumber>
              </div>
              <label v-else class="block text-center text-red-500" >{{suppWarning}}</label>
            </div>
          </div>

          <div v-if="isForResearch" class="grid grid-cols-[100px_auto] gap-3 gap-y-5">
            <p :class="{'pt-2 text-right ': true , 'text-error': (!defaultLabel) && showErrorMessage }">
              {{t('spanForm.correctedTerm')}}
            </p>
            <InputText
              v-model="defaultLabel"
              :placeholder="t('spanForm.correctedTermPlaceholder')"
              class="w-[calc(100%-110px)]"
            />
          </div>
          <div
            v-if="showLabelInput && !isForResearch && getPluginList.length !==0"
            class="grid grid-cols-[100px_auto] gap-3 gap-y-5"
          >
            <p class="pt-2 text-right">
              {{labelTitle}}
            </p>

            <InputText
              v-model="defaultLabel"
              :placeholder="labelTitle"
              class="w-[calc(100%-110px)]"
            />

          </div>
          <!--if 0 plugin -->
          <div
              v-if="getPluginList.length ===0"
              class="grid grid-cols-[100px_auto] gap-3 gap-y-5"
          >
            <b class="pt-2 text-right">
              Label
            </b>

            <InputText
                v-model="defaultLabel"
                placeholder="Label"
                class="w-[calc(100%-110px)]"
            />

          </div>
        </main-plugins-wrapper>

      </plugin-wrapper>

      <delete-wrapper v-else class="text-center py-8">
        {{t('spanForm.deleteConfirm')}}
      </delete-wrapper>

      <div class="flex flex-row justify-end gap-4">
        <Button outlined severity="primary" icon="pi pi-times" :label="t('actions.cancel')" @click=" close()" />
        <Button :label="t('actions.confirm')" icon="pi pi-check" @click=" handleConfirmationButton() " />
      </div>

    </div>
    <!-- MODALE D'ERREUR SUPERPOSÉE -->
    <AtomDialogFilterGroup
:visible="unauthorizedVirtualSpan"
                           :authorized-type-list="authorizedTypeList"
                           @update:visible="v => unauthorizedVirtualSpan = false"/>
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
