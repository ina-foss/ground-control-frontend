
import type { DisplayZone } from "~/api/generate"
import AtomVerifyToggle from "~/components/atoms/verifyToggle/AtomVerifyToggle.vue";
import {cleanText} from "~/utils/span";
import {Status} from "~/api/generate";

export default defineComponent({
  name:"MoleculePluginComponent",
  components: {AtomVerifyToggle},
  emits: ['update:errorMessage'],
  props:{
    zone:{
      type: String as PropType<DisplayZone>,
      required: true
    },
    errorMessage: {
      type: [Object, Boolean] as PropType<Record<string,boolean>> ,
      required: true,
    },
    textSpan:{
      type: String,
      required: true
    },
    pendingVerifiedStatus:{
      type: String as PropType<Status.PENDING | Status.VERIFIED>
    },
    currentSpan:{

    }
  },
  setup(props,{emit,expose}) {
    const { t } = useI18n()
    const { selectComponent } = usePluginStore()
    const {readPluginValues,pluginValues,defaultLabel ,isForResearch,mainPluginIndex} = useSpanService()
    const {getPluginList} = storeToRefs(usePluginStore())
    const labelTitle = ref()
    const {zone,textSpan,pendingVerifiedStatus,currentSpan} = props

    const showErrorMessage = computed(({
      get: () => props.errorMessage,
      set: (value) => emit('update:errorMessage',value) ,
    }))

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
      else if( (plugin.display_config.main_plugin  || plugin.display_config.required_value ) && ( event.length == 0 || event[0] == null)) showErrorMessage.value = true
    }


    const verifyStatus = ref<Record<string, 'pending' | 'verified'>>({})

    watch(
        pluginValues,
        (newValues) => {
          //parent
          tidiedPluginList.value[zone]?.forEach((plugin) => {
            const key = readPluginValues(plugin)
            if (plugin.display_config?.is_verifiable) {
              verifyStatus.value[key] = newValues[key]?.length && newValues[key][0] != null
                  ? Status.VERIFIED
                  : Status.PENDING
            }
            //child
            plugin.children?.forEach((child) => {
              if (child.display_config?.is_verifiable) {
                const childKey = readPluginValues(child)
                verifyStatus.value[childKey] = newValues[childKey]?.length && newValues[childKey][0] != null
                    ? Status.VERIFIED
                    : Status.PENDING
              }
            })
          })
        },
        { deep: true }
    )

    const showLabelInput = computed(() => {
      if(!isForResearch.value) {
        if (!mainPluginIndex.value) return true
        const selected = pluginValues[mainPluginIndex.value]?.[0]
        if (!selected || selected.editable ==="") return false
        labelTitle.value=selected.editable
        if(selected){
          if(currentSpan?.label && currentSpan?.label !== "")defaultLabel.value=currentSpan.label
          else {
            defaultLabel.value=selected.copyable ==='false'? "":cleanText(textSpan)

          }
        }
      }
      return true
    })

    expose({
      pluginSelected,
      checkPluginValues,
      verifyStatus
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
      t,
      verifyStatus,
      pendingVerifiedStatus,
      isForResearch,
      showLabelInput,
      labelTitle
    }
  }
})

