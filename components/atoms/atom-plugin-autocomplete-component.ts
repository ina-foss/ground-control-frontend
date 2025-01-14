import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import { remove } from 'lodash'
import { PluginService } from '~/api/generate'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: {type: Object},
    plugin: {},
  },
  emits:['add-to-chiplist'],
  async setup(props, {emit}){
    const showInput = ref(false)
    const value = ref([]);
    const { topicList  } = useTopicList()
    const items = ref([]);
    const {topicIndex, plugin} = toRefs(props)
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
      search,
    }
  }
})
