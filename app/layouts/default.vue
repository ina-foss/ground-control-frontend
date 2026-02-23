<template>
  <div class="h-screen max-h-screen flex flex-col">
    <Toast class="!top-[60px]"/>
    <MoleculeHeader />
    <div class="flex flex-col flex-1 overflow-hidden ">
      <div class="h-fit"> <!-- Assuming the breadcrumbs have a height of 70px (16rem) -->
        <AtomBreadcrumbs />
      </div>
      <main class="flex-grow w-full text-text bg-secondary">
        <slot />
      </main>
    </div>
  </div>
</template>



<script setup>
import MoleculeHeader from '~/components/molecules/MoleculeHeader.vue';
import AtomBreadcrumbs from "~/components/atoms/AtomBreadcrumbs.vue";

</script>

<style >
  @reference "../assets/css/app.css";

  html {
    font-size: 14px;
  }

  body {
    @apply text-base text-text
  }
  .p-tooltip-text {
    background-color: #595959 !important;
    color: white !important;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.10);
  }
  .p-tooltip-top .p-tooltip-arrow {
    border-top-color: #595959 !important;
  }
  .p-tooltip-bottom .p-tooltip-arrow {
    border-bottom-color: #595959 !important;
  }
  .p-tooltip-left .p-tooltip-arrow {
    border-left-color: #595959 !important;
  }
  .p-tooltip-right .p-tooltip-arrow {
    border-right-color: #595959 !important;
  }
</style>
