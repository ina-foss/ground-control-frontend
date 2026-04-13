import { defineComponent, inject  } from 'vue'
import { DisplayZone, Plugin } from "~/api/generate";
import type { PluginWithIdDto } from '~/api/generate'
import type { PropType } from 'vue'
import _ from 'lodash'
import {cleanText} from '~/utils/span'


export default defineComponent({
  name: 'AtomPluginAutocomplete',
  props: {
    topicIndex: { type: Number },
    plugin: { type: Object as PropType<PluginWithIdDto>, required: true },
    pluginItemsConfig: {},
    index: {},
    source: { required: false, default: () => false },
    pluginValue: { type: Array<any> },
    textSpan: { type: String },
    /**
     * Whether or not does the input will show the selectied options as showChips
     */
    showChips: {type:Boolean, default: ()=>true}
  },
  emits: ['update:pluginValue', 'last-selected'],
  setup(props, { emit }) {
    const value = ref([]);
    const { pluginItemsConfig, plugin, index, source, textSpan, showChips} = toRefs(props)
    const multipleValues = plugin.value.display_config?.multiple_values ?? false
    const pluginValue = computed({
      get: () => props.pluginValue ?? [],
      set: newValue =>{
        emit('update:pluginValue', newValue)
      }
    })

    const filteredOptions = ref( pluginItemsConfig.value ?? [])
    const emptyInput = ref([])

    // Depending if we show chips or not,
    // the plugin either use pluginValue directly or emptyInput that will be reset to not show chips
    const selectedValue = showChips.value ? pluginValue : emptyInput


    // When the emptyInput is updated, emit the change to pluginValue and reset the value
    watch(()=>emptyInput.value,(value)=>{
      if(value.length != 0){
        // check for duplicate
        const emittedValue =  pluginValue.value.every(item => !_.isEqual(item,value[0])) ?  [...pluginValue.value,...value] : pluginValue.value
        emit('update:pluginValue', emittedValue )
        emptyInput.value = []
      }
    },{immediate:true})

    const indexPlugin = index.value;

    // options either use the data (result of API search) or filter the default options list passed as props
    const options = computed(() => {
      let options
      if (data.value?.length > 0) {
        options = data.value
      }
      else if ((pluginItemsConfig.value) && (Array.isArray(pluginItemsConfig.value))) {
        options = filteredOptions.value
      }
      if (options){
        return options?.map(item => {
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
            ...item,
            plugin_id: plugin.value.id,
            image: parsedImage.length ? parsedImage : '/icons/icons-svg/icons-svg/no-image-placeholder.svg',
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

    const iconClass = computed(() => {
      return plugin.value?.display_config?.defaultValue
    })

    watch(pluginValue, (newValues, oldValues) => {
      if(newValues?.length == 0){
        document.getElementById('autocomplete-input').value = cleanText(textSpan.value)
      }
      emit('last-selected', newValues?.find(v => !oldValues?.includes(v))?.label)
    })

    // Function trigger when user type in filter AND
    // when dropdown is pressed
    function handleFilter(event) {
      if(plugin.value.config_data?.type != "plugin_static_data"){
        filterString.value = event.query
        // reserach even if the value didn't change
        executeSearch()
      }
      // filter the list already in memory
      else filteredOptions.value = pluginItemsConfig.value.filter(item => item.label.toLocaleLowerCase().includes(event.query.toLocaleLowerCase()))
    }

    const { data, status, execute: executeSearch } = useAsyncData(
      `plugin-search-${plugin.value?.id}`,
      async () => await Plugin.searchPluginsPluginsPluginIdSearchGet(plugin.value?.id, filterString.value || ""), { immediate: false })

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

    async function onDropdownOpen()   {
      if (textSpan.value !== "") {
        filterString.value = cleanText(textSpan.value)
        if (autoCompleteRef.value) {
          (autoCompleteRef.value as any).filterValue = filterString.value;
        }
      }
    }

    // show or hide the input in the plugin
    function changeInputStyle(pluginValue : Array<any>){
      const input = document.querySelector('[data-pc-section="inputchip"]')
      if(!input || !pluginValue  ) return
      if ( !multipleValues && pluginValue.length  ) input.style.display = 'none'
      if ( !multipleValues && !pluginValue.length) input.style.display = 'inline-flex'
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

      // if (document.getElementById('autocomplete-input') && autoCompleteRef.value) {
      //   const el = (autoCompleteRef.value as any).$el;
      //   document.getElementById('autocomplete-input').value = el?.querySelector('input') || null;
      // }

      if(document.getElementById('autocomplete-input') && textSpan.value ){
        document.getElementById('autocomplete-input').addEventListener('keydown', keydownHandler, { capture: true });
        // Add span text if nothing has already been selected
        if(pluginValue.value?.length == 0) document.getElementById('autocomplete-input').value = cleanText(textSpan.value)
      }
      changeInputStyle(selectedValue.value)
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
      multipleValues,
      maximumScrollHeight,
      iconClass,
      showChips,
      selectedValue,
      testOptions: filteredOptions
    }
  }
})
