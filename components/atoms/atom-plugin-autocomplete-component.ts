import {defineComponent} from 'vue'
import {useTopicList} from '../../composables/useTopicList'
import {inject} from 'vue';


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: {type: Object},
    plugin: {},
    pluginItemsConfig: {},
    index: {},
  },
  emits: ['add-to-chiplist'],
  async setup(props, {emit}) {
    const value = ref([]);
    const {topicList} = useTopicList()
    const {topicIndex, plugin, pluginItemsConfig, index} = toRefs(props)
    const indexPlugin = index.value;
    const selectedItems = ref();
    const options = ref();
    const pluginName = computed(() => {
      return plugin.value.name || "";
    });
    const chipList = inject('chipList');

    function updateValueFromSelectedItems() {
      if (selectedItems.value && selectedItems.value.length > 0) {
        value.value = [...selectedItems.value];
      }
    }

    watch(selectedItems, (newValue) => {
      updateValueFromSelectedItems();
      if (chipList.value) {
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

    onMounted(() => {
      if (chipList.value && plugin.value?.id) {
        selectedItems.value = chipList.value.filter(item => item.plugin_id === plugin.value.id);
      }
    });
    return {
      value,
      options,
      selectedItems,
      pluginName,
      indexPlugin,
    }
  }
})
