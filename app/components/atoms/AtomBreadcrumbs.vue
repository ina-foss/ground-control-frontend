<template>
  <Breadcrumb :home="home" class="breadcrumb-container border-0  " style="font-size: 12px;line-height:14px;">
    <template #item="{ props }">
      <template v-for="(breadcrumbItem, index) in newBreadCrumbs" :key="index" >

        <span
            v-if="index === newBreadCrumbs.length - 1"
            class="breadcrumb-item breadcrumb-current">
          <span :class="breadcrumbItem.icon" />
          {{ breadcrumbItem.label }}
        </span>
        <router-link v-else v-slot="{ navigate }" :to="breadcrumbItem.route" custom  >
          <a v-bind="props.action" class="breadcrumb-item last:hl-bd " style="color: #757575;cursor: pointer;"  @click.prevent="navigate()" >
          <span :class="breadcrumbItem.icon" />
          <span class="font-semibold">
            {{ breadcrumbItem.label }}
              <span class="breadcrumb-separator"> / </span>
            </span>
          </a>
        </router-link>
      </template>
    </template>
  </Breadcrumb>
</template>

<script setup>
import { useI18n } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()
const { $application } = useService();
const home = computed(() => ({
  label: t('project.title'),
  route: localePath('/dashboard')
}))
const isAdmin = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ADMIN));
const refresh = useRefreshStore()
const { getData } = storeToRefs(refresh)

const newBreadCrumbs = computed(()=>{
  const bd = [home.value]
  if (getData.value?.step){
    bd.push({
      label: getData.value.step.project.title,
      route: isAdmin.value
        ? localePath(`/projects/${getData.value.step.project.id}`)
        : localePath('/dashboard')
    })
    bd.push({
      label:("( "+getData.value?.step_id+" ) "+getData.value?.name ),
      route: isAdmin.value
       ?localePath(`/tasks/${getData.value?.id}`)
       : localePath('/dashboard')
       })
  }
  else{
    bd.push({
      label:getData.value?.title,
      route: isAdmin.value
        ? localePath(`/projects/${getData.value?.id}`)
        : localePath('/dashboard')
      })
  }

  return bd
})


</script>
<style>
.text-primary {
  color: #212529;
}
.font-bold {
  font-weight: bold;
}
.breadcrumb-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.breadcrumb-container a {
  white-space: nowrap;
  display: inline-flex;
}

.breadcrumb-separator {
  display: inline;
  margin: 0 5px;
}
.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  color: #212529;
}

.breadcrumb-current {
  font-weight: 700;
  color: #212529;
  cursor: default;
}
.font-semibold {
  font-weight: 600;
}
</style>
