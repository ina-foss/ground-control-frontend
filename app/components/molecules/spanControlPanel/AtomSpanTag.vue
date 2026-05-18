<template>
  <div class="expand-type min-w-0 flex items-center  ">
        <span
        :style="{
          backgroundColor : createSpanColorPalette(pluginId ,pluginValue),
          borderColor:createSpanColorPalette(pluginId,pluginValue,1),
          '--computed-width' : getMinSizeText() + 'px'
        }"
      :class="{'min-w-[80px] w-[80px] hover-span': expandable ,'w-fit':fluid , ' px-2 py-1 max-w-full transition-all duration-300 font-bold rounded border-2 inline-block text-xs/4 h-fit truncate  ' : true}" >
          <span v-if="getStatusOfVerify && !verifiedSpan"
              :style="{
          backgroundColor: '#FCDB00',
          borderColor: 'black',
          border: '1px solid black'
        }"
              class="inline-block w-2 h-2 rounded-full shrink-0"
          />
          {{text || "None"}}
        </span>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash'

const props = defineProps({
  pluginId: {
    type: Number,
    default: 0
  },
  pluginValue: {
    type: Array,
    default: () => []
  },
  text: {
    type: String,
    default: ''
  },
  /**
   * If true, the tag only show the beginning of the string in `text`.
   * Hover the component to see the full text
   **/
  expandable: {
    type: Boolean,
    default: false
  },
    /**
     * If true, compenent takes all the available place
     **/
  fluid: {
      type: Boolean,
      default : false
    },
  verifiedSpan:{
    type: Boolean,
    default : false
  },
  pluginList:{
    type: Array,
    default : () => []
  }
})

const {pluginId,pluginValue,text, expandable,fluid,verifiedSpan,pluginList} = toRefs(props)

  const {createSpanColorPalette } = useSpanService()

    const getStatusOfVerify = computed(()=>{
    const mainPlugin=pluginList?.value?.find(x=>x.id==pluginId.value)

    if(mainPlugin?.available_plugins?.length!==0){
      const pluginName=mainPlugin?.available_plugins?.[pluginValue?.value?.[0].ext_id]
      const pluginConfig=pluginList?.value?.find(x=>x.name==pluginName)
      return pluginConfig?.display_config.is_verifiable
    }
    else{
      return mainPlugin.display_config.is_verifiable ?? false
    }
  })

  function getMinSizeText(){
    const tempDiv =  document.createElement('div')
    tempDiv.classList.add('w-auto', 'px-2', 'rounded', 'border-4', 'inline-block', 'text-xs/4', 'h-fit', 'text-center')
    tempDiv.innerText = text.value
    document.body.appendChild(tempDiv)
    const width = tempDiv.getBoundingClientRect().width
    document.body.removeChild(tempDiv)
    return width
  }

</script>

<style scoped >
.hover-span:hover, .expand-type:hover .hover-span {
  width: var(--computed-width) !important
}
</style>

