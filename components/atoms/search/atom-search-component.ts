import {defineComponent} from "vue"
import _ from "lodash"

export default defineComponent({
  name: "AtomSearch",
  emits: ['find-element', 'unselect'],
  props: {
    spans: {type: Array, default: () => []},
    labels: {type: Array, default: () => []},
    list: {type: Array, default: () => []}// props
  },
  setup(props, {emit}) {

    const searchInterface: Ref<boolean> = ref(false)
    const selectedSearch = ref()
    const selectedSpan: Ref<Array<any>> = ref([])
    const {spans, labels, list} = toRefs(props)
    const searchIndex: Ref<number> = ref(0)
    const iterableSegment: Ref<Array<HTMLDivElement>> = ref([])
    const iterableSegmentSpan: Ref<Array<HTMLDivElement>> = ref([])
    const upIndex = () => {
      if ((searchIndex.value + 1 == selectedSpan.value.length && labels.value.length !== 0) || (searchIndex.value + 1 > iterableSegment.value.length - 1 && labels.value.length === 0)) {
        searchIndex.value = 0
      } else {
        searchIndex.value++
      }
    }

    const downIndex = () => {
      if (searchIndex.value - 1 < 0) {
        searchIndex.value = labels.value.length !== 0 ? selectedSpan.value.length - 1 : iterableSegment.value.length - 1
      } else {
        searchIndex.value--
      }
    }


    const correspondingSpan = (searchIndex: number): any => {
      const tcin = selectedSpan.value[searchIndex]?.getAttribute('tcin')
      const spanRef = _.find(spans.value, (span: any) => span.tcin == tcin)
      return spanRef
    }

    function invertInterface() {
      //afficher la zone de text a chercher
      searchInterface.value = !searchInterface.value
    }

    watch(() => selectedSpan.value, (array) => {
      if (array.length > 0) {
        const spanId = correspondingSpan(searchIndex.value)?.id
        if (spanId) {
          setTimeout(() => array[searchIndex.value]?.scrollIntoView({behavior: 'smooth'}), 100)
          emit('find-element', {index: spanId})
        } else if (iterableSegmentSpan.value.length !== 0) {
          emit('find-element', {div: iterableSegmentSpan.value[searchIndex.value]})
        } else {
          emit('find-element', {div: iterableSegment.value[searchIndex.value]})
        }
      } else emit('unselect')
    })

    watch(() => searchIndex.value, (newIndex, oldIndex) => {
      if (selectedSpan.value.length > 0) {
        const spanId = correspondingSpan(searchIndex.value)?.id
        if (spanId) {
          setTimeout(() => selectedSpan.value[newIndex]?.scrollIntoView({behavior: 'smooth'}), 100)
          emit('find-element', {index: spanId})
        } else if (iterableSegmentSpan.value.length !== 0) {
          emit('find-element', {div: iterableSegmentSpan.value[searchIndex.value]})
        } else {
          // iterableSegment.value[newIndex].firstElementChild?.classList.toggle('fond-bold')
          // iterableSegment.value[oldIndex].firstElementChild?.classList.toggle('font-bold')
          emit('find-element', {div: iterableSegment.value[newIndex]})
        }
      }
    })

    const highlightResults = () => {
      document.querySelectorAll(".highlight").forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(mark.textContent), mark);
          parent.normalize()
        }
      });

      if (!selectedSearch.value || selectedSearch.value.trim() === '') return;

      iterableSegment.value = []
      iterableSegmentSpan.value = []

      selectedSpan.value.forEach((span: HTMLDivElement) => {

        if (span) {
          const regex = new RegExp(`(${selectedSearch.value})`, "gi");
          const text = span.querySelector('.customText')?.textContent
          if (text) {
            const text = span.querySelector('.customText')?.textContent
            if (text.match(regex)) {
              const splittedText = text.split(regex)
              const newHTML = splittedText.map((part, i) =>
                i % 2 === 1 ? `<mark class="highlight" style="background-color: #0b7698; color: white; " >${part}</mark>` : part
              ).join('');
              splittedText.forEach((el, i) => {
                if (i % 2 === 1) {
                  iterableSegment.value.push(span)
                }
              })
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = newHTML;
              span.querySelector('.customText')?.replaceChildren(...tempDiv.childNodes)
            }
          } else {
            const words = span?.querySelectorAll('.inline-block');
            words.forEach((wordDiv) => {
              const text = wordDiv.textContent;
              if (text?.match(regex)) {
                const splittedText = text.split(regex)
                const textNode = [...wordDiv.childNodes].filter(node=>node.nodeType == 3).pop()
                textNode?.remove()
                splittedText.forEach((substring,index)=>{
                  if(index%2){
                    const mark = document.createElement('mark')
                    mark.innerText = substring
                    mark.classList.add('highlight')
                    mark.style.backgroundColor = '#0b7698'
                    mark.style.color = 'white'
                    wordDiv.appendChild(mark)
                    }
                  else{
                    wordDiv.appendChild(document.createTextNode(substring))
                  }
                })
                // newTextNode.innerHTML = text.replace(regex, '<mark class="highlight" style="background-color: #0b7698; color: white;">$1</mark>');
                iterableSegment.value.push(wordDiv); // Ajouter le mot surligné à la liste
                // iterableSegmentSpan.value.push(span); // Ajouter le bloc contenant le mot surligné à la liste
              }
            });
          }

        }
      });
    };

    watch(() => selectedSearch.value, (value) => {
      if (labels.value.length != 0) {
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
      } else {
        if (!value || value.trim() === '') {
          selectedSpan.value = [];
          selectedSearch.value = null;
          clear();
        } else {
          selectedSpan.value = [];
          selectedSpan.value = list.value.filter((el: HTMLDivElement) =>
            el.innerText.toLowerCase().includes(value.toLowerCase())
          );
          searchIndex.value = 0;
          highlightResults();
        }
      }
    })

    const clear = () => {
      selectedSearch.value = '';
      highlightResults();
    }
    return {
      selectedSpan,
      searchIndex,
      iterableSegment,
      iterableSegmentSpan,
      selectedSearch,
      searchInterface,
      invertInterface,
      downIndex,
      upIndex,
      list,
      clear,
      highlightResults
    }
  }
})
