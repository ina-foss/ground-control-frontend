<template>
    <div class="flex flex-wrap justify-center gap-3 p-3 ">
    <!-- WARN: The v-for loop reads the index 0 which represents no topic. Might use computed array without first index -->
        <div v-for="(color, index) in colors" :key="index">
          <div v-if="index != 0" class="flex h-8 items-center bg-white overflow-visible rounded border-surface-400 border-[1px]" >
            <div :style="`background-color: ${color}`" class="w-8 h-8 ml-[-1px]  rounded-sm flex justify-center z-10 items-center text-white font-bold text-sm ">#{{index}}</div>
            <h2 class="px-2 font-semibold" >Topic</h2>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">

  interface Props {
    colors: Array<string>
  }

  const { colors } = defineProps<Props>()

</script>
