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
const authService = useService()
const { userEmail } = storeToRefs(authStore);
const colorMode = useColorMode()
const menu = ref();
const items = computed(() => {
    const nextColorMode = colorMode.preference === "light" ? 'dark' : 'light'

    return [
        {
            label: 'Options',
            items: [
                {
                    label: `Toggle ${nextColorMode} `,
                    icon: 'pi toggle-icon',
                    command: () => {
                        toggleDarkMode()
                    }
                },
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
    ]
});

const toggle = (event) => {
    menu.value.toggle(event);
};



const toggleDarkMode = () => {
    if (colorMode.preference == 'dark') colorMode.preference = 'light'
    else colorMode.preference = 'dark'
}

const handleLogout = () => authService.$auth.logout()
</script>
