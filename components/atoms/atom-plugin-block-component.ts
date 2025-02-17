import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import AtomPluginAutocomplete from './AtomPluginAutocomplete.vue'
import AtomPluginLabel from './AtomPluginLabel.vue'
import {remove} from "lodash";
import {PluginService} from "~/api/generate";

export default defineComponent({
  name: 'AtomPluginBlock',
  components:{AtomPluginAutocomplete,AtomPluginLabel},
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean},
    source:{type: Boolean}
  },
  async setup(props, {emit}){
    const { topicList} = useTopicList()
    const {topicIndex,isTopicFirstSegment,source} = toRefs(props)

    const chipList = inject('chipList');
    const config = inject('plugin-config')
    const pluginItemsConfig = inject('plugin-items-config')
    onMounted(()=>{
      chipList.value = topicList.value[topicIndex.value]?.labels ;
      watch(()=>topicIndex.value,(newTopic,oldTopic)=>{
        chipList.value = topicList.value[newTopic]?.labels;
      })
    })

    function selectComponent(pluginConfig) {
      const itemlist=pluginItemsConfig.value
        .then((list) => {
          return list.find((item) => item.id === pluginConfig.id).data;
        })
      switch (pluginConfig.type) {
        case 'autocomplete':
          return {component: AtomPluginAutocomplete, props : {topicIndex: topicIndex, isTopicFirstSegment: isTopicFirstSegment,pluginItemsConfig:itemlist,source:source, chipList: chipList  } }
        case 'label':
          return {component: AtomPluginLabel, props : {topicIndex: topicIndex, isTopicFirstSegment: isTopicFirstSegment,pluginItemsConfig:pluginItemsConfig } }
        default:
          break;
      }
    }

    return {
      config,
      selectComponent,
      chipList,
      pluginItemsConfig

    }
  }
})
