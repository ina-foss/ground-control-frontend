<template>
  <div class=" grid grid-cols-[100px_auto] gap-4 gap-y-2 items-center" >

      <div class="col-span-2">

        <TransitionGroup name="group" tag="div">

    <div v-for="(row, index) in rows"
         :key="row.id"
         class="intervenant-row-wrapper"
    >
      <div class="intervenant-row">
            <plugin-title v-if="$slots.default " class="basis-[90px] shrink-0 ">
              <slot  />
            </plugin-title>
      <p class="pt-2"> {{ index + 1 }}</p>

        <Button
            v-if="groups.length"
            :label="getGroupLabel(row, groups[0])"
            @click="toggleType(row)"
            class="w-40"
        />

        <!-- MULTISELECT -->
        <MultiSelect
            v-for="group in groups.slice(1)"
            :key="group"
            v-model="row[group]"
            :options="optionsByGroup[group]"
            optionLabel="label"
            :placeholder="group"
            :class="{'basis-[calc(100%-365px)]': $slots.default}"
            :maxSelectedLabels="0"
            :selectedItemsLabel="getGroupLabel(row, group)"
            :label="getGroupLabel(row, groups[0])"
        />
        <div class="action-cell pt-1">

          <Button
              v-if="index === rows.length - 1"
              icon="pi pi-plus"
              rounded
              class="btn-add"
              @click="addRow(row)"
          />

          <Button
              v-else
              icon="pi pi-minus"
              rounded
              severity="secondary"
              class="btn-remove"
              @click="removeRow(row.id)"
          />
        </div>
      </div>
        <!-- CHECKBOX -->
        <div
            v-if="groups.length && row.showType"
            class="checkbox-row"
        >

          <div
              v-for="option in optionsByGroup[groups[0]]"
              :key="option.id"
              class="flex items-center gap-2"
          >
            <Checkbox
                v-model="row[groups[0]]"
                :value="option"
            />
            <label>{{ option.label }}</label>
          </div>
        </div>




    </div>
      </TransitionGroup>
    </div>

  </div>

</template>

<script src="./atom-plugin-multiSelectOptions-component.ts"></script>
<style scoped>
.intervenant-row-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.action-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
.checkbox-row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-left: 110px;
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

.intervenant-row {
  margin-bottom: 1rem;
  align-items: start;
  display: flex;
  gap: 0.4rem;
}

.intervenant-row :deep(.p-select) {
  width: 150px;
}
</style>
