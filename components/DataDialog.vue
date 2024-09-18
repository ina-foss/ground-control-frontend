<template>

  <div>
    <ProgressSpinner v-if="visibility"/>
    <p v-else> {{ data.data }} </p>


  </div>

</template>

<script setup>
const visibility = ref()

onBeforeMount(() => {
  visibility.value = props.visible
})

const props = defineProps(['data', 'visible'])


const {data} = await useFetch(`http://localhost:8000/task/${props.data}`)


onMounted(() => {
  visibility.value = false
})

</script>
