<template>
  <Breadcrumb :home="home" class="breadcrumb-container border-0  " style="font-size: 12px;line-height:14px;">
    <template #item="{ props }">
      <template v-for="(breadcrumbItem, index) in newBreadCrumbs" :key="index" >
        <router-link v-if="breadcrumbItem.route" v-slot="{ navigate }" :to="breadcrumbItem.route" custom  >
          <a v-bind="props.action" class="breadcrumb-item last:hl-bd " style="color: #757575;cursor: pointer;"  @click.prevent="navigate()" >
            <span :class="[breadcrumbItem.icon]" />
            <span :class="{ 'text-primary': true, 'font-bold' : index == newBreadCrumbs.length-1, 'font-semibold': index != newBreadCrumbs.length-1,  }">
              {{ breadcrumbItem.label }}
              <span v-if="index < newBreadCrumbs.length - 1 && newBreadCrumbs.length >1 " class="breadcrumb-separator"> / </span>
            </span>
          </a>
        </router-link>
      </template>
    </template>
  </Breadcrumb>
</template>

<script setup>
import { Permission } from '~/api/generate';
import { useI18n } from '#imports'

const { t } = useI18n()
const { $application } = useService();
const home = computed(() => ({
  label: t('project.title'),
  route: '/dashboard'
}))
const isAdmin = computed(() => $application.hasRole(Permission.GROUND_CONTROL_PROJECT_ADMIN));
const refresh = useRefreshStore()
const { getData } = storeToRefs(refresh)

const newBreadCrumbs = computed(()=>{
  let bd = [home.value]
  if (getData.value?.step){
    bd.push({
      label: getData.value.step.project.title,
      route: isAdmin.value
        ? `/projects/${getData.value.step.project.id}`
        : '/dashboard'
    })
    bd.push({
      label:("( "+getData.value?.step_id+" ) "+getData.value?.name ),
      route: isAdmin.value
       ?`/tasks/${getData.value?.id}`
       : '/dashboard'
       })
  }
  else{
    bd.push({
      label:getData.value?.title,
      route: isAdmin.value
        ? `/projects/${getData.value?.id}`
        : '/dashboard'
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
</style>
