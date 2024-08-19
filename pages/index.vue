<template>
  <div class=" flex items-center justify-center h-full" />
</template>

<script setup>
import { bcStore } from '~/stores/breadcrumbs';

const router = useRouter()
const store = bcStore()
const { removeLastCrumb } = store
const { getItems } = storeToRefs(store)


onMounted(()=>{
  let length = getItems.value.length // get breadcrumb list's length
  for (let index = 0; index < length; index++) {  // remove every breadcrumb
    removeLastCrumb()
}
    router.push("/dashboard")

</script>
