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
    const listIndex: Ref<number> = ref(0)
    const totalrecord: Ref<number> = ref(0)
    let searchResults: Ref<Array<{ index: number; count: number }>> = ref([]);
    let searchResultsCopy: Ref<Array<{ index: number; count: number }>> = ref([]);
    let up: Ref<boolean> = ref(false)
    const upIndex = () => {
      if (!up) {
        up = true;
        if (searchResults && searchResults.length > 0) {
          searchResultsCopy = searchResults.map(item => ({...item}));
        }
      }
      if (totalrecord.value === 0) {
        if (searchIndex.value + 1 == selectedSpan.value.length) {
          searchIndex.value = 0
        } else {
          searchIndex.value++
        }
      } else {
        if (listIndex.value + 1 == totalrecord.value) {
          searchIndex.value = 0
          listIndex.value = 0
          if (searchResults && searchResults.length > 0) {
            searchResultsCopy = searchResults.map(item => ({...item}));

          }

        } else if (searchResultsCopy[searchIndex.value].count === 1) {
          searchIndex.value++
          listIndex.value++
        } else {
          listIndex.value++
          searchResultsCopy[searchIndex.value].count--
        }
      }
    }

    const downIndex = () => {
      if (up) {
        up = false;
        if (searchResults && searchResults.length > 0) {
          searchResultsCopy = searchResults.map(item => ({...item}));
        }
      }
      if (totalrecord.value === 0) {
        if (searchIndex.value - 1 < 0) {
          searchIndex.value = selectedSpan.value.length - 1
        } else {
          searchIndex.value--
        }
      }
      else {
        if (searchIndex.value - 1 < 0) {
          searchIndex.value = selectedSpan.value.length - 1;
          listIndex.value = totalrecord.value - 1;
          if (searchResults && searchResults.length > 0) {
            searchResultsCopy = searchResults.map(item => ({...item}));

          }
        } else {
          if (searchIndex.value == 1 && listIndex.value == 1) {
            searchIndex.value--
            listIndex.value--
            if (searchResults && searchResults.length > 0) {
              searchResultsCopy = searchResults.map(item => ({...item}));

            }
          } else if (searchResultsCopy[searchIndex.value].count === 1) {
            searchIndex.value--
            listIndex.value--
          } else {
            listIndex.value--
            searchResultsCopy[searchIndex.value].count--
          }

        }
      }
    }


    const correspondingSpan = (searchIndex: number): any => {
      const tcin = selectedSpan.value[searchIndex].getAttribute('tcin')
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
        } else {
          emit('find-element', {div: array[searchIndex.value]})
        }
      } else emit('unselect')
    })

    watch(() => searchIndex.value, (index) => {
      if (selectedSpan.value.length > 0) {
        const spanId = correspondingSpan(searchIndex.value)?.id
        if (spanId) {
          setTimeout(() => selectedSpan.value[index]?.scrollIntoView({behavior: 'smooth'}), 100)
          emit('find-element', {div: spanId})
        } else {

          emit('find-element', {div: selectedSpan.value[index]})
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

      selectedSpan.value.forEach((span: HTMLDivElement) => {
        if (span) {
          const text = span.firstElementChild?.querySelector('.customText').textContent;
          const regex = new RegExp(`(${selectedSearch.value})`, "gi");

          if (text.match(regex)) {
            const newHTML = text.split(regex).map((part, i) =>
              i % 2 === 1 ? `<mark class="highlight" style="background-color: #0b7698; color: white; " >${part}</mark>` : part
            ).join('');
            totalrecord.value = totalrecord.value + countOccurrences(selectedSearch.value, text)
            listIndex.value = 0;
            searchResults.push({index: searchIndex.value, count: countOccurrences(selectedSearch.value, text)});
            searchResultsCopy = searchResults.map(item => ({...item}));
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newHTML;
            span.firstElementChild?.querySelector('.customText').replaceChildren(...tempDiv.childNodes);

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
          searchResults = [];
          totalrecord.value = 0;
          selectedSpan.value = list.value.filter((el: HTMLDivElement) =>
            el.innerText.toLowerCase().includes(value.toLowerCase())
          );
          searchIndex.value = 0;
          highlightResults();
        }
      }
    })

    function countOccurrences(word, text) {
      const regex = new RegExp(word, "gi");
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    }


    const clear = () => {
      selectedSearch.value = '';
      highlightResults();
    }
    return {
      selectedSpan,
      searchIndex,
      selectedSearch,
      searchInterface,
      invertInterface,
      downIndex,
      upIndex,
      list,
      clear,
      totalrecord,
      listIndex
    }
  }
})
