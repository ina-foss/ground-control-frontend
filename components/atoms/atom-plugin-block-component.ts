import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import AtomPluginAutocomplete from './AtomPluginAutocomplete.vue'
import AtomPluginLabel from './AtomPluginLabel.vue'
import {remove} from "lodash";

export default defineComponent({
  name: 'AtomPluginBlock',
  components:{AtomPluginAutocomplete,AtomPluginLabel},
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean}
  },
  setup(props, {emit}){

    const { topicList,chipList } = useTopicList()
    const {topicIndex,isTopicFirstSegment} = toRefs(props)

    const config = inject('plugin-config')
    function handleRemove(index){
      remove(topicList.value,(el)=>chipList.value[index] == el)
      remove(chipList.value,(el,removeIndex)=>{
        removeIndex === index
      })
    }
    function selectComponent(pluginConfig) {
      switch (pluginConfig.type) {
        case 'autocomplete':
          return {component: AtomPluginAutocomplete, props : {topicIndex: topicIndex, isTopicFirstSegment: isTopicFirstSegment } }
        case 'label':
          return {component: AtomPluginLabel, props : {topicIndex: topicIndex, isTopicFirstSegment: isTopicFirstSegment } }
        default:
          break;
      }
    }


    return {
      config,
      selectComponent,
      chipList,
      handleRemove
    }
  }
})
