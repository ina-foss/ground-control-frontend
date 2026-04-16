<template>
      <plugin-wrapper  class="flex flex-col gap-5  ">
        <main-plugins-wrapper class="flex flex-col gap-5  ">
          <plugin-iterator v-for="(plugin,index) in tidiedPluginList[zone]" class="flex flex-col gap-3 ">
            <div class="" >
              <component :is="selectComponent(plugin).component" v-bind="selectComponent(plugin).props" v-model:plugin-value="pluginValues[readPluginValues(plugin)]" :index="index" :text-span="textSpan" @update:plugin-value="pluginChangeValue(plugin,$event)" :error="showErrorMessage?.[plugin.name]" >
                <p :class="{'pt-2 text-right ': true , 'text-error':showErrorMessage && !showErrorMessage?.[plugin.name] }">{{ ( plugin?.display_config?.label || plugin?.name.charAt(0).toUpperCase() +  plugin?.name.slice(1) ) }} </p>
              </component>
            </div>
            <div v-for="(child,childIndex) in childPluginMap[readPluginValues(plugin)]" v-if="childPluginMap[readPluginValues(plugin)] != undefined " :key="child.id" class="">
                <component :is="selectComponent(child).component" v-bind="selectComponent(child).props" v-model:plugin-value="pluginValues[readPluginValues(child)]" :index="childIndex" :text-span="textSpan">
                  <p class="text-right ">{{  child?.display_config?.label || child?.name.charAt(0).toUpperCase() + child?.name.slice(1)  }}</p>
                </component>
            </div>
          </plugin-iterator>

        </main-plugins-wrapper>

      </plugin-wrapper>
</template>

<script src="./molecule-plugin-component.ts" lang="ts" ></script>
