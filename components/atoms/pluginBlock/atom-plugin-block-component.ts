import { defineComponent } from 'vue'
import { useTopicList } from '../../../composables/useTopicList'
import AtomPluginAutocomplete from '../pluginAutocomplete/AtomPluginAutocomplete.vue'
import AtomPluginLabel from '../pluginLabel/AtomPluginLabel.vue'


export default defineComponent({
  name: 'AtomPluginBlock',
  components:{AtomPluginAutocomplete,AtomPluginLabel},
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean},
    source:{type: Boolean}
  },
   setup(props, {emit}){
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
      if (!pluginItemsConfig.value) return null;
      switch (pluginConfig.type) {
        case 'autocomplete':
          const itemlist=pluginItemsConfig.value
            .then((list) => {
              return list.find((item) => item.id === pluginConfig.id).data;
            })
          return {component: AtomPluginAutocomplete, props : {topicIndex: topicIndex, pluginItemsConfig:itemlist,source:source  } }
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
