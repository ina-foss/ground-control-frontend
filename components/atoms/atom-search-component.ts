import { defineComponent } from "vue"
import _ from "lodash"

export default defineComponent({
  name:"AtomSearch",
  emits: ['find-span','unselect'],
  props: {
    spans: { type: Array, default: () => [] },
    labels: { type: Array, default: () => []}
  },
  setup({spans}, { emit }){

    const searchInterface : Ref<boolean> = ref(false)
    const selectedSearch = ref()
    const selectedSpan : Ref<Array<HTMLElement>> = ref([])
    const searchIndex: Ref<number> = ref(0)

    const upIndex = () =>{
      if (searchIndex.value+1 == selectedSpan.value.length) searchIndex.value = 0
      else searchIndex.value++
    }

    const downIndex = () =>{
      if (searchIndex.value-1 < 0 ) searchIndex.value =  selectedSpan.value.length-1
      else searchIndex.value--
    }


    const correspondingSpan = (searchIndex: number): any  =>{
      const tcin = selectedSpan.value[searchIndex].getAttribute('tcin')
      const spanRef = _.find(spans, (span: any)=> span.tcin == tcin)
      return spanRef
    }

    function invertInterface  ()  {
      searchInterface.value = !searchInterface.value
    }

    watch(()=>selectedSpan.value,(array)=>{
      if( array.length > 0 ){
        setTimeout(()=>array[searchIndex.value]?.scrollIntoView({behavior: 'smooth'}),100)
        emit('find-span',{index: correspondingSpan(searchIndex.value).id})
      }
      else emit('unselect')
    })

    watch(()=>searchIndex.value,(index)=>{
      if( selectedSpan.value.length > 0 ){
        setTimeout(()=> selectedSpan.value[index]?.scrollIntoView({behavior: 'smooth'}),100)
        emit('find-span',{index: correspondingSpan(index).id})
      }
    })

    watch(()=>selectedSearch.value,(value)=> {
      if( value &&  value != ''){
        selectedSpan.value = []
        spans.forEach(span  => {
          const spanDom : HTMLElement | null = document.querySelector(`[tcin="${span.tcin}"]`)
          if(spanDom?.innerText.includes(selectedSearch.value)){
            selectedSpan.value.push(spanDom)
          }
        });

      }
      else selectedSpan.value = []
    })
    return{
      selectedSpan,
      searchIndex,
      selectedSearch,
      searchInterface,
      invertInterface,
      downIndex,
      upIndex
    }
  }
})
