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
    source:{}
  },
  emits: ['add-to-chiplist'],
  async setup(props, {emit}) {
    const value = ref([]);
    const {topicList} = useTopicList()
    const {topicIndex, plugin, pluginItemsConfig, index,source} = toRefs(props)
    const indexPlugin = index.value;
    const selectedItems = ref();
    const options = ref();
    const pluginName = computed(() => {
      return plugin.value.name || "";
    });
    const chipList = inject('chipList');
    const multiSelectRef = ref(null);
    // rouvrir le dropdown dès qu'il se ferme
    const keepDropdownOpen = () => {
        if (multiSelectRef.value) {
          multiSelectRef.value.overlayVisible = true;
        }
    };

    // Empêche le clic sur l'élément qui ouvre/ferme la liste
    const preventDropdownClick = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };

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
        else{
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

    onMounted(() => {
      if (chipList.value && plugin.value?.id) {
        selectedItems.value = chipList.value.filter(item => item.plugin_id === plugin.value.id);
      }
      if(source.value){
        nextTick(() => {
          if (multiSelectRef.value) {
            setTimeout(()=>{
              multiSelectRef.value.overlayVisible = true;
            },200)
          }
        });
      }
    });
    return {
      value,
      options,
      selectedItems,
      pluginName,
      indexPlugin,
      source,
      keepDropdownOpen,
      multiSelectRef,
      preventDropdownClick
    }
  }
})
