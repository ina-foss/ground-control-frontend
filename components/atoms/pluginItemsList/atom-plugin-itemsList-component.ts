import _ from 'lodash'
import type { PluginWithIdDto } from '~/api/generate'
export default defineComponent({
  name: 'AtomPluginItemslist',
  props: {
    pluginValue: {
      type: Object,
    },
    plugin: {type :Object as PropType<PluginWithIdDto>, required: true},
    pluginItemsConfig: {},
  },
  emits:['update:pluginValue'],
  computed: {
    visibleOptions() {
      if(!this.isForResearch) return this.allOptions
      return this.allOptions.slice(0, this.plugin?.display_config?.max_items ?? 4);

    },
    dropdownOptions() {
      return  _.difference(this.allOptions, this.visibleOptions)
    },
  },
  setup(props, {emit}) {
    const {isForResearch, createSpanColorPalette } = useSpanService()

    const {groupDisplay,plugin,pluginItemsConfig : pluginItemsConfig} = toRefs(props)


    const allOptions = computed(()=> data.value ?? pluginItemsConfig.value.map(plugin=>{
      if( plugin.categories && !Array.isArray(plugin.categories) ){
        plugin.categories = JSON.parse(plugin.categories?.replace(/'/g, '"'))
      }
      return plugin
      }
    ))


    const { data, status, execute: executeSearch } = useAsyncData(async ()=> await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value),{immediate: false})

    const pluginValue = computed({
        get: () => Array.isArray(props.pluginValue) ? props.pluginValue[0] : props.pluginValue,
        set : newValue => Array.isArray(newValue) ? emit('update:pluginValue',newValue) : emit('update:pluginValue',[newValue])
    })

    return {
      isEqual: _.isEqual,
      pluginValue,
      groupDisplay,
      allOptions,
      isForResearch
    }
  },
})
