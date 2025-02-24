import { defineComponent } from "vue"
import _ from "lodash"

export default defineComponent({
  name:"AtomSearch",
  emits: ['find-element','unselect'],
  props: {
    spans: { type: Array, default: () => [] },
    labels: { type: Array, default: () => []},
    list: { type: Array, default: () => []}// props
  },
  setup(props, { emit }){

    const searchInterface : Ref<boolean> = ref(false)
    const selectedSearch = ref()
    const selectedSpan : Ref<Array<any>> = ref([])
    const {spans,labels,list} = toRefs(props)
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
      const spanRef = _.find(spans.value, (span: any)=> span.tcin == tcin)
      return spanRef
    }

    function invertInterface  ()  {
      //afficher la zone de text a chercher
      searchInterface.value = !searchInterface.value
    }

    watch(() => selectedSpan.value, (array) => {
      if (array.length > 0) {
        const spanId = correspondingSpan(searchIndex.value)?.id
        if (spanId) {
          setTimeout(() => array[searchIndex.value]?.scrollIntoView({ behavior: 'smooth' }), 100)
          emit('find-element', { index: spanId })
        } else {
          emit('find-element', { div: array[searchIndex.value] })
        }
      }
      else emit('unselect')
    })

    watch(() => searchIndex.value, (index) => {
      if (selectedSpan.value.length > 0) {
        const spanId = correspondingSpan(searchIndex.value)?.id
        if (spanId) {
          setTimeout(() => selectedSpan.value[index]?.scrollIntoView({ behavior: 'smooth' }), 100)
          emit('find-element', { div: spanId })
        } else {
          emit('find-element', { div: selectedSpan.value[index] })
        }
      }
    })

    watch(()=>selectedSearch.value,(value)=> {
      if(labels.value.length != 0) {
        if (value && value != '') {
          selectedSpan.value = []
          spans.value.forEach(span => {
            const spanDom: HTMLElement | null = document.querySelector(`[tcin="${span.tcin}"]`)
            if (spanDom?.innerText.includes(selectedSearch.value)) {
              selectedSpan.value.push(spanDom)
            }
          });
          searchIndex.value = 0
        } else selectedSpan.value = []
      }
      else {
        if (value && value != '') {
          selectedSpan.value = []
          selectedSpan.value =  list.value.filter((el: HTMLDivElement)=> { return el.innerText.includes(selectedSearch.value)})
        }
      }
    })
    return{
      selectedSpan,
      searchIndex,
      selectedSearch,
      searchInterface,
      invertInterface,
      downIndex,
      upIndex,
      list,
    }
  }
})
