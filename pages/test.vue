<template>
  <div class="flex flex-col p-[10%] gap-3 justify-center items-center h-screen">
    <Toast />
    <SelectButton :unstyled="true" v-model="labelSelected" :options="labels" aria-labelledby="basic" />
    <div @mouseup="handleSelection"  id="text">{{text}}</div>
    <InputText v-model="state.range" class="border-black border-3"/>
    <Button label="button" @click="deleteSelection" />
    <InputSwitch />

</div>
</template>

<script setup lang="ts">
import { random } from 'lodash';
import { useToast } from 'primevue/usetoast';

const toast = useToast()
const labelSelected = ref('Person')
const labels = ['Person','Citation','Verbe']
const text = ref('Mercredi soir, le chef d’Etat a évacué l’idée d’adouber Lucie Castets, candidate officielle de la coalition de gauche : "Le sujet n’est pas un nom donné par une formation politique. La question est quelle majorité peut se dégager à l’Assemblée pour que le gouvernement de la France puisse passer des réformes."')
const state = reactive({
  selection: null as Selection | null,
  range: null as Range | null
})

const selectionText = computed(() => {
  if (state.range != null) {
    return state.range.extractContents()
  }
  return ''
})

function generatePastelColor(tagNumber) {
  // Use tag number to create a seed (this is a basic example, there are better ways to do this)
  const seed = tagNumber * 123456789;
  const random = s => ((seed * s) % 155) + 100;  // Between 100 and 255

  const r = random(3);
  const g = random(5);
  const b = random(7);

  return `rgb(${r}, ${g}, ${b}, 1)`;
}

const handleSelection = () => {
  const currentSelection = document.getSelection()
  if (currentSelection && currentSelection.toString() !== '') {
    state.selection = currentSelection
    state.range = currentSelection.getRangeAt(0)
    // console.log(state.election.focusNode)
    // console.log(state.range)
    // console.log(selectionText.value)
    let span = document.createElement('span')
    span.style.backgroundColor = generatePastelColor(random(0,15,true))
    span.setAttribute('label', labelSelected.value );
    span.style.overflow
    // span.classList= "p-1 fit-content inline-flex  after:content-[attr(label)] relative  after:box-border after:pl-2 after:leading-none after:h-[10px] after:self-start after:top-0 after:right-0 after:text-xs "
    span.classList = "highlighted-text";
    span.appendChild(selectionText.value)
    state.range.insertNode(span)
    state.selection.empty()
    state.selection = null


  }
}

const deleteSelection = () => {
  toast.add({severity:"error", detail:"Project could not be created", summary:"Something went wrong"})
  if (state.selection) {
    let span = document.createElement('sup')
    span.style.backgroundColor = "red"
    span.appendChild(selectionText.value)
    state.range.insertNode(span)
  }

}


</script>

<style >
.highlighted-text {
  display: inline;
  position: relative;
}

.highlighted-text::after {
  display: inline;
  content: attr(label);
  vertical-align:super;
  padding-left: 0.5rem;
  font-size: 0.70rem;
}
</style>
