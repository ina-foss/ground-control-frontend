<template>
  <div class=" grid grid-cols-[100px_auto] pt-3 gap-4 gap-y-5 items-center" >

    <slot/>
      <InputText
          v-model="defaultLabel"
          :placeholder="plugin.display_config.label"
          :class="['w-[calc(100%-110px)]', hasError ? 'p-invalid' : '']"
      />
  </div>
</template>

<script src="./atom-plugin-inputLabel-component.ts">
</script>
