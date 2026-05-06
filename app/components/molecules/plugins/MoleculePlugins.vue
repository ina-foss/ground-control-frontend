<template>
      <plugin-wrapper  class="flex flex-col gap-5  ">
        <main-plugins-wrapper class="flex flex-col gap-5" v-if="tidiedPluginList[zone] && Object.keys(tidiedPluginList[zone]).length !==0">
          <plugin-iterator v-for="(plugin,index) in tidiedPluginList[zone]" class="flex flex-col gap-3 ">
            <div class="" >
              <component :is="selectComponent(plugin).component" v-bind="selectComponent(plugin).props" v-model:plugin-value="pluginValues[readPluginValues(plugin)]" :index="index" :textSpan="textSpan" @update:plugin-value="pluginChangeValue(plugin,$event)" :error="showErrorMessage?.[plugin.name]" >
                <p :class="{'pt-2 text-right ': true , 'text-error':showErrorMessage && !showErrorMessage?.[plugin.name] }">{{ ( plugin?.display_config?.label || plugin?.name.charAt(0).toUpperCase() +  plugin?.name.slice(1) ) }} </p>
              </component>
            </div>
            <div v-for="(child,childIndex) in childPluginMap[readPluginValues(plugin)]" v-if="childPluginMap[readPluginValues(plugin)] != undefined " :key="child.id" class="" >
                <component :is="selectComponent(child).component" v-bind="selectComponent(child).props" v-model:plugin-value="pluginValues[readPluginValues(child)]" :index="childIndex" :textSpan="textSpan">
                  <p class="text-right ">{{  child?.display_config?.label || child?.name.charAt(0).toUpperCase() + child?.name.slice(1)  }}</p>
                </component>
            </div>
            <div v-if="isForResearch" class="grid grid-cols-[100px_auto] gap-3 gap-y-5 pt-2">
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
                v-if="showLabelInput && !isForResearch && pluginValues && Object.keys(pluginValues).length !==0"
                class="grid grid-cols-[100px_auto] gap-3 gap-y-5 pt-2"
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
            <template v-for="(child) in childPluginMap[readPluginValues(plugin)]">
              <atomVerifyToggle
                  v-if="child?.display_config?.is_verifiable"
                  v-model:plugin-value="verifyStatus[readPluginValues(child)]"
                  :pendingVerifiedStatus="pendingVerifiedStatus"
              />
            </template>
            <Divider class="!w-[calc(100%-70px)]" v-if="index!==Object.keys(tidiedPluginList[zone]).length-1"></Divider>
          </plugin-iterator>
        </main-plugins-wrapper>
        <!--if 0 plugin -->
        <div
            v-else
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

      </plugin-wrapper>
</template>

<script src="./molecule-plugin-component.ts" lang="ts" ></script>
