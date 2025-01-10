import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import { remove } from 'lodash'
import { PluginService } from '~/api/generate'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean},
    plugin: {},
  },
  async setup(props){
    const showInput = ref(false)
    const value = ref([]);
    const { topicList,chipList  } = useTopicList()
    const items = ref([]);
    const {topicIndex,isTopicFirstSegment, plugin} = toRefs(props)
    onMounted(()=>{
      chipList.value = topicList.value[topicIndex.value]?.labels || [];
    })
    const referenceAutoComplete = await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value.id, ' ')
    const search = (event) => {
        items.value =  referenceAutoComplete.filter((el)=> el.label.includes(event.query))
    }

    watch(()=>value.value,(items)=>{
      topicList.value[topicIndex.value]?.labels.push(items[0])
      items.pop();
    })

    return {
      showInput,
      value,
      items,
      chipList,
      search,
    }
  }
})
