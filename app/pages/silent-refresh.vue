<template>

    <h3> Refreshing Token</h3>

</template>

<script setup>

    const authService = useService()
    const router = useRouter()


    const silentRefreshOidc = async () => {
        try{
            await authService.$auth.renewToken()
            router.push("/")
        } catch (error) {
            console.error(error)
        }
    }

    await silentRefreshOidc()

</script>
