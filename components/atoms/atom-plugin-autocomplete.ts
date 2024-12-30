import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import { find, remove } from 'lodash'
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
    const { topicList } = useTopicList()
    const items = ref([]);
    const chipList = ref([])
    const {topicIndex,isTopicFirstSegment, plugin} = toRefs(props)
    const referenceAutoComplete = await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value.id, ' ')
    const search = (event) => {
        items.value =  referenceAutoComplete.filter((el)=> el.label.includes(event.query))
    }

    function handleRemove(index){
      remove(topicList.value,(el)=>chipList.value[index] == el)
      remove(chipList.value,(el,removeIndex)=>{
          removeIndex === index
      })
    }

    watch(()=>value.value,(items)=>{
      topicList.value[topicIndex.value].labels.push(items[0])
      chipList.value.push(items.pop())
    })

    return {
      showInput,
      value,
      items,
      chipList,
      search,
      handleRemove
    }
  }
})
