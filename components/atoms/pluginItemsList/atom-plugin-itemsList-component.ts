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

    const { data } = useAsyncData(async ()=> await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id,""),{immediate: false})

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

    onMounted(()=>{
      console.log({'pluginValue':pluginValue.value})
    })

    const visibleOptions  = computed(() => {
      if(!isForResearch.value) return allOptions.value
      return allOptions.value.slice(0, plugin.value?.display_config?.max_items ?? 4)
    })

    const dropdownOptions = computed( () => {
      return  _.difference(allOptions.value, visibleOptions.value)
    })

    const groupButtonLayout = computed(()=>{
      return allOptions.value.some(option=>option.group)
    })

    const groupByOptions =  computed(()=>_.groupBy(allOptions.value,"group"))

    const pluginValue = computed({
        get: () => Array.isArray(props.pluginValue) ? props.pluginValue[0] : props.pluginValue,
        set : newValue => Array.isArray(newValue) ? emit('update:pluginValue',newValue) : emit('update:pluginValue',[newValue])
    })

    /**
      Generates a customized label by removing the object's group name from its label.

      The function:
      - Normalizes the group's name to lowercase and removes a trailing "s" (plural form).
      - Checks whether the label contains the group name (case-insensitive).
      - If it does, removes the group name from the label, cleans extra spaces,
        and returns the result with an uppercase first letter.
      - If not, returns the original label unchanged.

      Param :
        object: An object containing at least a `group` and a `label` property.
      Returns :
        A cleaned and formatted label string.
     */

    function customizedLabel(object:any) {
      const group = object.group.toLowerCase().replace(/s$/, "");
      if (object.label.toLowerCase().includes(group)) {
        const newLabel= object.label.replace(new RegExp(group, "i"), "").replace(/\s+/g, " ").trim();
        return newLabel.charAt(0).toUpperCase() + newLabel.slice(1);
      }
      return object.label
    }

    return {
      isEqual: _.isEqual,
      pluginValue,
      groupDisplay,
      allOptions,
      isForResearch,
      visibleOptions,
      dropdownOptions,
      all_entities_plugin,
      groupButtonLayout,
      groupByOptions,
      customizedLabel
    }
  },
})
