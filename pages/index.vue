<template>
  <div class=" flex items-center justify-center h-full" />
</template>

<script setup>
import { bcStore } from '~/stores/breadcrumbs';

const router = useRouter()
const store = bcStore()
const { removeLastCrumb } = store
const { getItems } = storeToRefs(store)

const length = getItems.value.length

for (let index = 0; index < length; index++) {
    removeLastCrumb()
}
    router.push("/dashboard")

</script>
