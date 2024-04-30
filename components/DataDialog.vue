<template>

<div>
    <ProgressSpinner v-if="visible" />
    <p v-else> {{ data.data }} </p>

    
    
</div>

</template>

<script setup>
const visible = ref()

onBeforeMount(() => {
    visible.value = props.visible
    console.log('before mounted')
})

const props = defineProps(['data','visible'])



const {data, pending, status, error, refresh }= await useFetch(`http://localhost:8000/task/${props.data}`)



onMounted(() => {  
    visible.value=false
    console.log('mounted')
})

</script>