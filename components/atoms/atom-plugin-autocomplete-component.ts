import { defineComponent } from 'vue'
import { useTopicList } from '../../composables/useTopicList'
import { remove } from 'lodash'
import { PluginService } from '~/api/generate'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: {type: Object},
    plugin: {},
    pluginItemsConfig:{},
  },
  emits:['add-to-chiplist'],
  async setup(props, {emit}){
    const showInput = ref(false)
    const value = ref([]);
    const { topicList  } = useTopicList()
    const items = ref([]);
    const {topicIndex, plugin,pluginItemsConfig} = toRefs(props)
    const search = (event) => {
      pluginItemsConfig.value.then((e)=>{
        items.value =  e.filter((el)=> el.label.includes(event.query))
      })
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
