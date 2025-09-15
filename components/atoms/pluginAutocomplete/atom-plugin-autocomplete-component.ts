import {defineComponent} from 'vue'
import {inject} from 'vue';
import {PluginService} from "~/api/generate";
import type { PluginWithIdDto } from '~/api/generate'
import type {PropType} from 'vue'
import _ from 'lodash'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: {type: Number},
    plugin: {type :Object as PropType<PluginWithIdDto>, required: true},
    pluginItemsConfig: {},
    index: {},
    source: {required: false, default: ()=>false},
    pluginValue:{type: Array},
  },
  emits: ['update:pluginValue'],
  setup(props, {emit}) {
    const value = ref([]);
    const {pluginItemsConfig, plugin, index, source} = toRefs(props)
    const indexPlugin = index.value;
    let debounceTimer : NodeJS.Timeout
    const options = computed(()=>{
       if ( data.value?.length > 0) {
          return data.value?.map(item => ({
            id: item.id,
            ext_id: item.ext_id,
            label: item.label,
            plugin_id: plugin.value.id,
            description: item?.description,
            image: item?.image,
          }));
      }
      else if ((pluginItemsConfig.value) && (Array.isArray(pluginItemsConfig.value))) {
          return pluginItemsConfig.value.map(item => ({
            id: item.id,
            ext_id: item.ext_id,
            label: item.label,
            plugin_id: plugin.value.id,
            description: item?.description,
            image: item?.image,
          }));
      }
      else return []
    });
    const filterString : Ref<string> = ref('');
    const isAnnotationEditable = inject('isAnnotationEditable')
    const pluginName = computed(() => {
      return plugin.value.name || "";
    });
    const multiSelectRef = ref(null);
    const keepDropdownOpen = () => {
      multiSelectRef.value.overlayVisible = true;
    }

    const pluginValue = computed({
        get: () => props.pluginValue,
        set : newValue => emit('update:pluginValue',newValue)
    })

    function handleFilter(event) {
      clearTimeout(debounceTimer)
       debounceTimer = setTimeout(()=>{
        filterString.value = event.value
      }, 300)

    }

    const { data, status, execute: executeSearch } = useAsyncData(
      `plugin-search-${plugin.value?.id}`,
      async ()=> await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value),{immediate: false})

    const showSkeleton = computed(()=>{
        return status.value == 'pending'
    })

    // Sort the options array by the ascending position of the filter string in each option's label
    const sortedOptionsByFilter = computed(()=>{
      return options.value?.sort((a ,b)=> a.label.indexOf(filterString.value.toLowerCase()) - b.label.indexOf(filterString.value.toLowerCase()))
    })


    watch(()=>filterString.value, async (newFilter) => {
      if(newFilter.trim().length != 0 && plugin.value?.id) {
        await executeSearch()
      }
    })


    onMounted(() => {
      if (source.value) {
        if (multiSelectRef.value) {
          setTimeout(() => {
            multiSelectRef.value.overlayVisible = true;
          }, 200)
        }
      }
    });
    return {
      value,
      options,
      pluginValue,
      pluginName,
      showSkeleton,
      indexPlugin,
      handleFilter,
      source,
      isAnnotationEditable,
      keepDropdownOpen,
      sortedOptionsByFilter,
      multiSelectRef,
    }
  }
})
