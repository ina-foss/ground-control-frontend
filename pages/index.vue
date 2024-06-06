
<template>
    <div class="dark:bg-gray-700 flex items-center justify-center min-h-screen">
        <Button v-tooltip="'Tooltip Text'" label="Logout" link @click="handleLogout" />
        <Button v-tooltip="'Tooltip Text'" label="Login" link @click="handleLogin" />
        <InputText placeholder="text input" />
        <Button  icon="pi pi-ellipsis-h" severity="secondary" text size="small" @click="visible = true" />
                <Dialog v-model:visible="visible"  header="Tasks Settings"/>
        
    </div>
</template>

<script setup>
import { UserService } from '../api/generate';
import { useService } from '../composables/useService';


const visible = ref(false)
const authService = useService()

const handleLogout = () => authService.$auth.logout()
const handleLogin = () => authService.$auth.signInCallback()

</script>


<style>

@import url(/assets/css/base.css);


</style>
