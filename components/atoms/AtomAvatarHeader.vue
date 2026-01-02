<template>
        <Avatar ref="avatar"
          v-tooltip.left="userEmail"
          style="background-color: transparent;"
 class="cursor-pointer" shape="circle"
                @click="toggle" >
          <img
            style="height:24px;width:24px;
          filter: brightness(0) saturate(100%) invert(11%) sepia(5%) saturate(250%) hue-rotate(180deg) brightness(90%) contrast(90%);"
            src="public/icons/icons-svg/icons-svg/account-icon.svg"
            alt="Account Icon">
        </Avatar>
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuth()
const authService = useService()
const { userEmail } = storeToRefs(authStore);
const colorMode = useColorMode()
const menu = ref();
defineExpose({ menu })
const items = computed(() => {
    const isLight = colorMode.preference === 'light'

    return [
        {
          label: t('menu.options'),
          items: [
                {
                  label: isLight
                    ? t('menu.switchToDark')
                    : t('menu.switchToLight'),
                    icon: 'pi toggle-icon',
                    command: () => {
                        toggleDarkMode()
                    }
                },
                {
                    label: t('menu.refreshToken'),
                    icon: 'pi pi-refresh',
                    command: () => {
                        router.push("/silent-refresh")
                    }
                },
                {
                    label: t('menu.logout'),
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

<style>
.toggle-icon:before {
    content: "\e9c7";
}

:root[class="dark"] .toggle-icon:before {
    content: "\e9c8";
}
</style>
