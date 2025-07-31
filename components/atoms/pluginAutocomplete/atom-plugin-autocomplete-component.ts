import {defineComponent} from 'vue'
import {useTopicList} from '../../../composables/useTopicList'
import {inject} from 'vue';
import {PluginService} from "~/api/generate";
import type { PluginWithIdDto } from '~/api/generate'
import type {PropType} from 'vue'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: {type: Object},
    plugin: {type :Object as PropType<PluginWithIdDto>, required: true},
    pluginItemsConfig: {},
    index: {},
    source: {}
  },
  emits: ['add-to-chiplist'],
  setup(props, {emit}) {
    const value = ref([]);
    const {topicList} = useTopicList()
    const {topicIndex, plugin, pluginItemsConfig, index, source} = toRefs(props)
    const indexPlugin = index.value;
    const selectedItems = ref();
    let debounceTimer : NodeJS.Timeout
    const options = ref();
    const filterString : Ref<string> = ref('');
    const isAnnotationEditable = inject('isAnnotationEditable')
    const pluginName = computed(() => {
      return plugin.value.name || "";
    });
    const chipList = inject('chipList');
    const multiSelectRef = ref(null);
    const keepDropdownOpen = () => {
      multiSelectRef.value.overlayVisible = true;
    }


    function handleFilter(event) {
      clearTimeout(debounceTimer)
       debounceTimer = setTimeout(()=>{
        filterString.value = event.value
      }, 300)

    }

    const { data, status, execute: executeSearch } = useAsyncData(async ()=> await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value),{immediate: false})

    const showSkeleton = computed(()=>{
        return status.value == 'pending'
    })

    // Sort the options array by the ascending position of the filter string in each option's labelc:w
    const sortedOptionsByFilter = computed(()=>{
      return options.value?.sort((a ,b)=> a.label.indexOf(filterString.value.toLowerCase()) - b.label.indexOf(filterString.value.toLowerCase()))
    })

    function updateValueFromSelectedItems() {
      if (selectedItems.value && selectedItems.value.length > 0) {
        value.value = [...selectedItems.value];
      }
    }

    watch(selectedItems, (newValue) => {
      updateValueFromSelectedItems();
      if (chipList.value ) {
        const searchedSelectedItems = chipList.value.filter(item => item.plugin_id === plugin.value.id);
        if (searchedSelectedItems.length < selectedItems.value.length) {
          if (value.value.length > 0) {
            topicList.value[topicIndex.value]?.labels.push(value.value[value.value.length - 1]);
          }
        } else {
          searchedSelectedItems.forEach((item) => {
            const existsInSelectedItems = selectedItems.value.some(selectedItem => selectedItem.id === item.id);
            if (!existsInSelectedItems) {
              const indexToRemove = chipList.value.findIndex(chip => chip.id === item.id);
              if (indexToRemove !== -1) {
                chipList.value.splice(indexToRemove, 1); // Suppression
              }
            }
          });
        }
      }

    });

    watch(
      () => chipList.value,
      (newVal) => {
        const itemsChiplistPlugin = chipList.value.filter(item => item.plugin_id === plugin.value.id);
        if (itemsChiplistPlugin.length < selectedItems?.value?.length) {
          selectedItems.value.forEach((item) => {
            const existsInChiplist = itemsChiplistPlugin.some(chipItem => chipItem.id === item.id);
            if (!existsInChiplist) {
              const indexToRemove = selectedItems.value.findIndex(selectedItem => selectedItem.id === item.id);
              if (indexToRemove !== -1) {
                selectedItems.value.splice(indexToRemove, 1);
              }
            }

          })
        } else {
          selectedItems.value = chipList.value.filter(item => item.plugin_id === plugin.value.id);
        }
      },
      {
        deep: true
      }
    )
    ;
    watchEffect(async () => {
      if (pluginItemsConfig.value) {
        const response = await pluginItemsConfig.value;
        if (Array.isArray(response)) {
          options.value = response.map(item => ({
            id: item.id,
            ext_id: item.ext_id,
            label: item.label,
            plugin_id: plugin.value.id,
          }));
        }
      }
    });

    watch(()=>filterString.value, async (newFilter) => {
      if(newFilter.trim().length != 0) {
        await executeSearch()
        if (Array.isArray(data.value)) {
          options.value = data.value.map(item => ({
            id: item.id,
            ext_id: item.ext_id,
            label: item.label,
            plugin_id: plugin.value.id,
          }));
        }
      }
      else{
        options.value = []
      }
    })


    onMounted(() => {
      if (chipList.value && plugin.value?.id) {
        selectedItems.value = chipList.value.filter(item => item.plugin_id === plugin.value.id);
      }
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
      selectedItems,
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
