<template>
  <div class=" flex items-center justify-center min-h-screen">
    <Button v-tooltip="'Tooltip Text'" label="Logout" @click="handleLogout" link />
    <Button v-tooltip="'Tooltip Text'" label="Login" @click="handleLogin" link />
    <InputText placeholder="text input" />
    <Button icon="pi pi-ellipsis-h" severity="secondary" text size="small" @click="visible = true" />
    <h3 class="dark:text-white text-slate-900">Text light/dark</h3>
    <Dialog v-model:visible="visible" header="Tasks Settings">
    </Dialog>
    <toggleSwitch />
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
