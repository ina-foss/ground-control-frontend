// tests/components/BreadcrumbComponent.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BreadcrumbComponent from '@/components/atoms/AtomBreadcrumbs.vue'
import PrimeVue from 'primevue/config'
import Breadcrumb from 'primevue/breadcrumb'
import { createRouter, createWebHistory } from 'vue-router'
import {createI18n} from "vue-i18n";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dashboard', name: 'dashboard' },
    { path: '/projects/:id', name: 'project' },
    { path: '/tasks/:id', name: 'task' },
  ],
})
const i18n = createI18n({
  legacy: false,
  locale: 'fr'
})
describe('BreadcrumbComponent.vue', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })

  it('affiche les breadcrumbs pour un projet sans step', async () => {
    const wrapper = mount(BreadcrumbComponent, {
      props: {
        data: {
          id: '123',
          title: 'Projet A',
          step: {
            project: {
              id: '789',
              title: 'Projet A',
            },
          },
        },
      },
      global: {
        plugins: [router, PrimeVue,i18n],
        components: { Breadcrumb },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('project.title  /')


  })


  it('navigue lorsqu’un breadcrumb est cliqué', async () => {
    const wrapper = mount(BreadcrumbComponent, {
      props: {
        data: {
          id: '456',
          name: 'Tâche 1',
          step: {
            project: {
              id: '789',
              title: 'Projet B',
            },
          },
        },
      },
      global: {
        plugins: [router, PrimeVue,i18n],
        components: { Breadcrumb },
      },
    })

    await wrapper.vm.$nextTick()
    const links = wrapper.findAll('a')
    expect(links[0]).toBeDefined()
    if (links[0]) {
      await links[0].trigger('click')
      expect(router.currentRoute.value.fullPath).toBe('/')
    }
  })
})
