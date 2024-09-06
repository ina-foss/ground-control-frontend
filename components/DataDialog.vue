<template>

  <div>
    <ProgressSpinner v-if="visible"/>
    <p v-else> {{ data.data }} </p>


  </div>

</template>

<script setup>
const visible = ref()

onBeforeMount(() => {
  visible.value = props.visible
})

const props = defineProps(['data', 'visible'])


const {data} = await useFetch(`http://localhost:8000/task/${props.data}`)


onMounted(() => {
  visible.value = false
})

</script>
