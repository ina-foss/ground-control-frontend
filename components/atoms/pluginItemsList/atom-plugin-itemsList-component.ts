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
    const {isForResearch } = useSpanService()

    const {groupDisplay,plugin,pluginItemsConfig : pluginItemsConfig} = toRefs(props)

    const all_entities_plugin =  {
      id: "",
      ext_id: "",
      label: "Chercher",
      description: null,
      image: null,
      categories:null,
    }
    const allOptions = computed(()=> data.value ?? pluginItemsConfig.value.map(plugin=>{
      if( plugin.categories && !Array.isArray(plugin.categories) ){
        plugin.categories = JSON.parse(plugin.categories?.replace(/'/g, '"'))
      }
      return plugin
      }
    ))


    const { data } = useAsyncData(async ()=> await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value),{immediate: false})

    const pluginValue = computed({
        get: () => Array.isArray(props.pluginValue) ? props.pluginValue[0] : props.pluginValue,
        set : newValue => Array.isArray(newValue) ? emit('update:pluginValue',newValue) : emit('update:pluginValue',[newValue])
    })
    onMounted(() => {
      if(props.plugin.available_plugins) {
        const foundPlugin = (props.plugin.available_plugins as Record<string, any>)['']
        if (foundPlugin) {
          emit('update:pluginValue', [all_entities_plugin])
        }
      }
    })

    const onClearSelect = async (event: any) => {
      if (event.value === null) {
        await nextTick()
        pluginValue.value = all_entities_plugin
      }
    }
    return {
      isEqual: _.isEqual,
      pluginValue,
      groupDisplay,
      allOptions,
      isForResearch,
      all_entities_plugin,
      onClearSelect
    }
  },
})
