import type { PluginWithIdDto } from "~/api/generate"
import { PluginService, DisplayZone  } from "~/api/generate"
import AtomPluginAutocomplete from '../components/atoms/pluginAutocomplete/AtomPluginAutocomplete.vue'
import AtomPluginLabel from '../components/atoms/pluginLabel/AtomPluginLabel.vue'
import AtomPluginItemslist from "~/components/atoms/pluginItemsList/AtomPluginItemslist.vue"

export const usePluginStore = defineStore('plugin',{
  state: () =>{
    return {
      /**
       * List of all the plugin loaded
       **/
      pluginList:[] as PluginWithIdDto[],
      /**
       * List of options array for each plugin
       **/
      pluginOptionsList: [] as Array<any>,
    }
  },
  actions: {

    setPluginList(newPluginList: PluginWithIdDto[]){
      this.pluginList = newPluginList
    },

    /**
    * fetch all the plugins associated to the step id and the type of annotation screen
    **/
    async updatePluginList(step_id: number,annotation_type: string){

      let availableZones: DisplayZone[]

      switch(annotation_type){
        case  'segmentation' :
        case  'auto-summary' :
          availableZones = [DisplayZone.BLOC]
          break;
        case 'span':
          availableZones = [DisplayZone.SPAN_MODAL_LEFT,DisplayZone.SPAN_MODAL_RIGHT,DisplayZone.GROUP_MODAL]
          break;
        default:
          availableZones = []
      }

      return PluginService.readAllPluginsPluginsStepStepIdDisplayGet(step_id,availableZones)
      .then((response)=> this.setPluginList(response))
    },

    async initialFetch(){
      const result = Promise.all(
        this.pluginList.map(async (item) => {
          const result = await PluginService.searchPluginsPluginsPluginIdSearchGet(item.id, ' ')
          return {
            id: item.id,
            data: result,
          };
        })
      );
      this.pluginOptionsList = await result
    },

    selectComponent(pluginConfig: PluginWithIdDto) {
      if (this.pluginOptionsList.length == 0) return null;
      switch (pluginConfig.type) {
        case 'autocomplete':{
          const itemlist= this.pluginOptionsList.find((item) => item.id === pluginConfig.id).data
          return {component: AtomPluginAutocomplete, props : { pluginItemsConfig:itemlist, plugin: pluginConfig } }
        }
        case 'label':
          return {component: AtomPluginLabel, props : { isTopicFirstSegment: isTopicFirstSegment,pluginItemsConfig:pluginItemsConfig } }
        case 'listitems':{
          const itemlist= this.pluginOptionsList.find((item) => item.id === pluginConfig.id).data
          return {component: AtomPluginItemslist, props:{pluginItemsConfig: itemlist, plugin: pluginConfig}}
        }
        default:
          break;
      }
    }

  },
  getters:{
    getPluginList(state): PluginWithIdDto[]{
      return state.pluginList
    },
    getAllPluginOptionList(state): PluginWithIdDto[]{
      return state.pluginOptionsList
    }
  }
})
