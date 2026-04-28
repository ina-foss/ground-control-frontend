<template>
  <div class=" grid grid-cols-[100px_auto] pt-3 gap-4 gap-y-5 items-center" >

      <div class="col-span-2">

        <TransitionGroup name="intervenant" tag="div">
          <div
              v-for="(intervenant, index) in intervenants"
              :key="intervenant._id"
              class="intervenant-row pb-5"
          >
            <plugin-title v-if="$slots.default" class="basis-[90px] shrink-0">
              <slot  />
            </plugin-title>
            <p class="pt-2"> {{ index + 1 }}</p>

            <InputText
                v-model="intervenant.nom"
                :placeholder="t('plugin.fields.personName')+(index + 1)"
                @blur="updateIntervenant(intervenant._id)"
            />

            <Select
                :class="{'basis-[calc(100%-400px)]': $slots.default}"
                v-model="intervenant.role"
                :options="roles"
                option-label="label"
                option-value="id"
                :placeholder="t('spanForm.virtualSpan.role')+String.fromCharCode(64 + index + 1)"
                @update:model-value="updateIntervenant(intervenant._id)"
            />

            <div class="action-cell pt-1">

              <Button
                  v-if="index === intervenants.length - 1"
                  icon="pi pi-plus"
                  rounded
                  class="btn-add"
                  @click="intervenants.push(createIntervenant())"
              />

              <Button
                  v-else
                  icon="pi pi-minus"
                  rounded
                  severity="secondary"
                  class="btn-remove"
                  @click="removeIntervenant(intervenant._id)"
              />
            </div>

          </div>

        </TransitionGroup>
      </div>

    </div>
</template>

<script src="./atom-plugin-entityListInput-component.ts">
</script>

<style scoped>

.intervenant-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.intervenant-row :deep(.p-select) {
  width: 150px;
}
.btn-remove {
  width: 2rem !important;
  height: 2rem !important;
  flex-shrink: 0;
}

.btn-add {
  margin-left: auto;
  flex-shrink: 0;
  width: 2rem !important;
  height: 2rem !important;
}
:deep(.p-select:focus) {
  box-shadow: none !important;
  border-color: #ccc !important;
}


</style>
