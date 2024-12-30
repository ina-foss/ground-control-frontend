import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import AtomPluginAutocomplete from './AtomPluginAutocomplete.vue'
import AtomPluginLabel from './AtomPluginLabel.vue'

export default defineComponent({
  name: 'AtomPluginBlock',
  components:{AtomPluginAutocomplete,AtomPluginLabel},
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean}
  },
  setup(props, {emit}){

    const { topicList } = useTopicList()
    const {topicIndex,isTopicFirstSegment} = toRefs(props)

    const config = inject('plugin-config')

    function selectComponent(pluginConfig) {
      switch (pluginConfig.type) {
        case 'autocomplete':
          return {component: AtomPluginAutocomplete, props : {topicIndex: topicIndex, isTopicFirstSegment: isTopicFirstSegment,config: config }}
        case 'label':
          return {component: AtomPluginLabel, props : {topicIndex: topicIndex, isTopicFirstSegment: isTopicFirstSegment } }
        default:
          break;
      }
    }


    return {
      config,
      selectComponent
    }
  }
})
