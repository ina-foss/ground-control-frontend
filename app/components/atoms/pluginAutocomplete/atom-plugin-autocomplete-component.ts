import { defineComponent } from 'vue'
import { inject } from 'vue';
import { DisplayZone, PluginService } from "~/api/generate";
import type { PluginWithIdDto } from '~/api/generate'
import type { PropType } from 'vue'
import _ from 'lodash'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: { type: Number },
    plugin: { type: Object as PropType<PluginWithIdDto>, required: true },
    pluginItemsConfig: {},
    index: {},
    source: { required: false, default: () => false },
    pluginValue: { type: Array<any> },
    textSpan: { type: String }
  },
  emits: ['update:pluginValue', 'last-selected'],
  setup(props, { emit }) {
    const value = ref([]);
    const max_length = 1
    const { pluginItemsConfig, plugin, index, source, textSpan} = toRefs(props)
    const pluginValue = computed({
      get: () => props.pluginValue ?? [],
      set: newValue => emit('update:pluginValue', newValue)
    })

    const indexPlugin = index.value;
    let debounceTimer: NodeJS.Timeout
    const options = computed(() => {
      if (data.value?.length > 0) {
        return data.value?.map(item => {
          let parsedImage ;
          if(item.image){
            try {
              parsedImage = JSON.parse(item.image.replace(/'/g, '"'));
            } catch {
              parsedImage = item.image;
            }
          }
          else{
            parsedImage = [];
          }
          return {
            id: item.id,
            ext_id: item.ext_id,
            label: item.label,
            plugin_id: plugin.value.id,
            description: item?.description,
            image: parsedImage.length ? parsedImage : '../../../icons/icons-svg/icons-svg/no-image-placeholder.svg'
          }
        });
      }
      else if ((pluginItemsConfig.value) && (Array.isArray(pluginItemsConfig.value))) {
        return pluginItemsConfig.value.map(item => {
          let parsedImage ;
          if(item.image){
            try {
              parsedImage = JSON.parse(item.image.replace(/'/g, '"'));
            } catch {
              parsedImage = item.image;
            }
          }
          else{
            parsedImage = [];
          }
          return {
            id: item.id,
            ext_id: item.ext_id,
            label: item.label,
            plugin_id: plugin.value.id,
            description: item?.description,
            image: parsedImage.length ? parsedImage : '../../../icons/icons-svg/icons-svg/no-image-placeholder.svg'
          }
        })
      }
      else return []
    });
    const filterString: Ref<string> = ref('');
    const isAnnotationEditable = inject('isAnnotationEditable')
    const pluginName = computed(() => {
      return plugin.value?.display_config?.label || plugin.value.name || "";
    });
    const autoCompleteRef = ref(null);
    const keepDropdownOpen = () => {
      autoCompleteRef.value.overlayVisible = true;
    }

    const showValue = computed(() => {
      return plugin.value.display_zone != DisplayZone.BLOC
    })


    watch(pluginValue, (newValues, oldValues) => {
      if(newValues?.length == 0) document.getElementById('autocomplete-input').value = textSpan.value?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()
      emit('last-selected', newValues?.find(v => !oldValues?.includes(v))?.label)
    })

    function handleFilter(event) {
        filterString.value = event.query
    }

    const { data, status, execute: executeSearch } = useAsyncData(
      `plugin-search-${plugin.value?.id}`,
      async () => await PluginService.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value), { immediate: false })

    const showSkeleton = computed(() => {
      return status.value == 'pending'
    })

    // Sort the options array by the ascending position of the filter string in each option's label
    const sortedOptionsByFilter = computed(() => {
      return options.value?.sort((a, b) => a.label.indexOf(filterString.value?.toLowerCase()) - b.label.indexOf(filterString.value?.toLowerCase()))
    })

    const maximumScrollHeight = computed(()=>{
      if(autoCompleteRef.value){
        const autocompletePositionY = autoCompleteRef.value.$el.getBoundingClientRect().y
        const viewportHeight = window.innerHeight
        const maxheight  = Math.max(autocompletePositionY, viewportHeight - autocompletePositionY)
        return Math.min(maxheight, 500)
      }
    })


    watch(() => filterString.value, async (newFilter) => {
      if (newFilter?.trim().length != 0 && plugin.value?.id) {
        await executeSearch()
      }
    })

    async function onDropdownOpen()   {
      if (textSpan.value !== "") {
        filterString.value = textSpan.value?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()
        if (autoCompleteRef.value) {
          (autoCompleteRef.value as any).filterValue = filterString.value;
        }
      }
    }

    function changeInputStyle(pluginValue : Array<any>){
      // show or hide the input in the plugin
      const input = document.querySelector('[data-pc-section="inputchip"]')
      if(!input || !pluginValue ) return
      if (pluginValue.length >= max_length) input.style.display = 'none'
      if (pluginValue.length < max_length) input.style.display = 'inline-flex'
    }


    watch(()=>pluginValue.value,(value: Array<any>)=>{
      changeInputStyle(value)
    },{deep:true})

    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.stopImmediatePropagation();
      }
    };

    onMounted(() => {

      if (!document.getElementById('autocomplete-input') && autoCompleteRef.value) {
        const el = (autoCompleteRef.value as any).$el;
        document.getElementById('autocomplete-input').value = el?.querySelector('input') || null;
      }

      if(document.getElementById('autocomplete-input') && textSpan.value ){
        document.getElementById('autocomplete-input').addEventListener('keydown', keydownHandler, { capture: true });
        // Add span text if nothing has already been selected
        if(pluginValue.value?.length == 0) document.getElementById('autocomplete-input').value = textSpan.value?.replace(/^[.,';\s]+|[.,';\s]+$/g, " ").trim()
      }
      changeInputStyle(pluginValue.value)
      if (source.value) {
        if (autoCompleteRef.value) {
          setTimeout(() => {
            autoCompleteRef.value.overlayVisible = true;
          }, 200)
        }
      }
    });
    onBeforeUnmount(() => {
      if (document.getElementById('autocomplete-input')) {
        document.getElementById('autocomplete-input').removeEventListener('keydown', keydownHandler, { capture: true });
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
      autoCompleteRef,
      onDropdownOpen,
      textSpan,
      showValue,
      max_length,
      maximumScrollHeight
    }
  }
})
