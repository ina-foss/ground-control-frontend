
<template>
    <div class="dark:bg-gray-700 flex items-center justify-center min-h-screen">
        <Button v-tooltip="'Tooltip Text'" label="Submit" link />
        <InputText placeholder="text input" />
        <Button  icon="pi pi-ellipsis-h" severity="secondary" text size="small" @click="visible = true" />
                <Dialog v-model:visible="visible"  header="Tasks Settings">

                </Dialog>
        
    </div>
</template>

<script setup>

const visible = ref(false)

</script>


<style>
@import url(/assets/css/base.css);
</style>
