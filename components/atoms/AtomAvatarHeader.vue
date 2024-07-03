<template>
    <div>
        <Avatar
v-tooltip.left="userEmail" class="cursor-pointer" icon="pi pi-user" shape="circle"
                @click="toggle" />

        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
    </div>
</template>

<script setup>

const router = useRouter()
const authStore = useAuth()
const { userEmail } = storeToRefs(authStore);
const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Refresh token',
                icon: 'pi pi-refresh',
                command: () => {
                    router.push("/silent-refresh")
                }
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    handleLogout()
                }
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

const handleLogout = () => authService.$auth.logout()
</script>
