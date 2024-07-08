<template>
    <div class="flex flex-wrap justify-center gap-3 p-3 ">
    <!-- WARN: The v-for loop reads the index 0 which represents no topic. Might use computed array without first index -->
        <div v-for="(color, index) in colors" :key="index">
          <div v-if="index != 0" class="flex items-center bg-white rounded border-black border-[1px]" >
            <div :style="`background-color: ${color}`" class="w-7 h-7 rounded-sm flex justify-center items-center text-white font-bold text-sm ">#{{index}}</div>
            <h2 class="px-1" >Topic</h2>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">

  interface Props {
    colors: Array<Number>
  }

  const { colors } = defineProps<Props>()

</script>
