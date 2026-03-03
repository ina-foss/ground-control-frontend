import { defineComponent } from 'vue'
import AtomPluginAutocomplete from '../pluginAutocomplete/AtomPluginAutocomplete.vue'
import AtomPluginLabel from '../pluginLabel/AtomPluginLabel.vue'
import { usePluginStore } from '~/stores/plugins'
import type {PluginAutocompleteValueDTO} from "~/api/generate"
import type { PluginAutocompleteValueWithMetadata } from '~/composables/useSpanService'


export default defineComponent({
  name: 'AtomPluginBlock',
  components:{AtomPluginAutocomplete,AtomPluginLabel},
  props: {
    topicIndex: {type: Number},
    isTopicFirstSegment: {type: Boolean},
    source:{type: Boolean},
    pluginValues: {type: Object as ()=> Record<string,PluginAutocompleteValueWithMetadata[]>}
  },
  emits:['update:pluginValues'],
  setup(props,{emit} ){
    const {getPluginList} = storeToRefs(usePluginStore())

    const { selectComponent } = usePluginStore()

    const pluginValues = computed({
        get: ()  => props.pluginValues,
        set : newValue  => emit('update:pluginValues',newValue)
    })

    const config = getPluginList.value

    return {
      config,
      selectComponent,
      pluginValues
    }
  }
})
