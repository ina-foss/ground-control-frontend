
import type { DisplayZone } from "~/api/generate"

export default defineComponent({
  name:"MoleculePluginComponent",
  emits: ['update:errorMessage'],
  props:{
    zone:{
      type: Object as PropType<DisplayZone>,
      required: true
    },
    errorMessage: {
      type: Object as PropType<Record<string,boolean>> ,
      required: true,
    }
  },
  setup(props,{emit,expose}) {
    const { t } = useI18n()
    const { selectComponent } = usePluginStore()
    const {readPluginValues,pluginValues,extractTextFromSpanNodes, affectPluginValues, initPluginValues, deleteSpan ,reccursiveSibling ,computeColorByLabel, spanMenuSelected, labelSelected, spanArray, applySpan, defaultLabel ,newFocus,isForResearch,deletedNum, mainPluginIndex } = useSpanService()
    const {getPluginList} = storeToRefs(usePluginStore())

    const {zone} = props

    const showErrorMessage = computed(({
      get: () => props.errorMessage,
      set: (value) => emit('update:errorMessage',value) ,
    }))

    const textSpan=ref()
    let filteredPlugins=[]
    const pluginSelected=ref('');

    const tidiedPluginList = computed(()=>{
      const listPlugin= getPluginList.value
      const childIds = new Set(
          listPlugin.flatMap(plugin => plugin.children?.map(child => child.id) ?? [])
      );
       filteredPlugins = listPlugin.filter(plugin => !childIds.has(plugin.id));
      return Object.groupBy( filteredPlugins,({display_zone})=>display_zone)
    })

    const extIdMap = computed(()=>{
      const newVal = pluginValues
      const firstObj = Array.isArray(newVal) ? newVal[0] ?? {} : newVal ?? {};
      const result = Object.entries(firstObj).reduce<Record<string, string>>((acc, [dataProperty, value]) => {
        const val = Array.isArray(value) ? value[0] : value;
        acc[dataProperty] = "";
        if (val && typeof val === "object" && "ext_id" in val) {
          acc[dataProperty] = val.ext_id;
        }
        return acc;
      }, {})
      return result
    })


    type checkPluginOption = {
      check_all?: boolean
    }

    function checkPluginValues(checkPluginOption?){
     const result =  tidiedPluginList.value[zone]?.reduce((acc,plugin) => {
        const pluginCheck = ( !plugin.display_config?.required_value && !plugin.display_config?.main_plugin) && !checkPluginOption?.check_all || (Boolean(pluginValues[readPluginValues(plugin)]?.length) && pluginValues[readPluginValues(plugin)][0] )
        acc[plugin.name] = pluginCheck // store check value for main plugins
        plugin.children?.filter(child=>plugin.available_plugins?.[pluginValues[readPluginValues(plugin)]?.[0]?.ext_id] == child.name).forEach((child)=>{
         const childCheck = !child.display_config?.required_value ||  Boolean(pluginValues[readPluginValues(child)].length)
         acc[child.name] = childCheck // store check value for current child plugin
        })
        return acc
      },{})

      return result
    }

    const childPluginMap = computed(()=>{
      const result = {}
      Object.entries(extIdMap.value).forEach(([dataProperty, extId]) => {
        const usedPlugin = getPluginList.value?.find(
          plugin =>{
            return readPluginValues(plugin) === dataProperty
          }
        );
        if (usedPlugin?.available_plugins && usedPlugin.children?.length !== 0) {
          const pName = (usedPlugin.available_plugins as Record<string, any>)[extId];
          if (pName) {
            const childrenPlugin = getPluginList.value?.find(plugin => plugin.name === pName);
            if (childrenPlugin) {
              if (!result[dataProperty]) {
                result[dataProperty] = [];
                pluginSelected.value = "";
              }
              result[dataProperty].push(childrenPlugin);
            } else {
              pluginSelected.value = pName;
            }
          }
          else{
            pluginSelected.value = "";
          }
        }
      });
      return result
    })

    function PickErrorByPlugin(pluginName,target){
      const result = Object.entries(showErrorMessage.value).find(([name,value] )=> name == pluginName && target? value :  !value)
      return result
    }

    function pluginChangeValue(plugin: PluginWithIdDto,event){
      if( (plugin.display_config.main_plugin || plugin.display_config.required_value || PickErrorByPlugin(plugin.name, false) ) && event.length != 0 && event[0] != null ) showErrorMessage.value = false
      else if( (plugin.display_config.main_plugin  || plugin.display_config.required_value ) && ( event.length == 0 || event[0] == null)) showErrorMessage.value[plugin.name] = true
    }


    expose({
      pluginSelected,
      checkPluginValues
    })

    return{
      zone,
      pluginChangeValue,
      tidiedPluginList,
      childPluginMap,
      extIdMap,
      showErrorMessage,
      selectComponent,
      readPluginValues,
      pluginValues,
      pluginSelected,
      textSpan,
      defaultLabel,
      t
    }
  }
})

