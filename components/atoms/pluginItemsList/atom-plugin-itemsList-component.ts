import _ from 'lodash'
import type { PluginWithIdDto } from '~/api/generate'
import { PluginService } from '~/api/generate'

export default defineComponent({
  name: 'AtomPluginItemslist',
  props: {
    pluginValue: {
      type: Object,
    },
    plugin: {type :Object as PropType<PluginWithIdDto>, required: true},
    pluginItemsConfig: {},
    groupDisplay: {}
  },
  emits:['update:pluginValue'],
  setup(props, {emit}) {
    const { isForResearch } = useSpanService()

    const {groupDisplay,plugin,pluginItemsConfig : pluginItemsConfig} = toRefs(props)

    const { data } = useAsyncData(async ()=> await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value),{immediate: false})

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

    const visibleOptions  = computed(() => {
      if(!isForResearch.value) return allOptions.value
      return allOptions.value.slice(0, plugin.value?.display_config?.max_items ?? 4)
    })

    const dropdownOptions = computed( () => {
      return  _.difference(allOptions.value, visibleOptions.value)
    })



    const pluginValue = computed({
        get: () => Array.isArray(props.pluginValue) ? props.pluginValue[0] : props.pluginValue,
        set : newValue => Array.isArray(newValue) ? emit('update:pluginValue',newValue) : emit('update:pluginValue',[newValue])
    })

    return {
      isEqual: _.isEqual,
      pluginValue,
      groupDisplay,
      allOptions,
      isForResearch,
      visibleOptions,
      dropdownOptions,
      all_entities_plugin,
    }
  },
})
