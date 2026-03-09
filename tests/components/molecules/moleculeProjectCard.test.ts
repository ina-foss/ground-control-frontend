import { expect, describe, it, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import MoleculeProjectCard from '~/components/molecules/MoleculeProjectCard.vue'
import MoleculeFormProject from '~/components/molecules/MoleculeFormProject.vue'
import { ProjectService } from '~/api/generate';
import { Dialog, Popover } from 'primevue';
import { createI18n } from 'vue-i18n'
import { reactive } from 'vue'

const mockedProject = {
  title: "Project creation",
  description: "test",
  status: "draft",
  is_published: false,
  empty_annotations: false,
  allow_skip: false,
  control_weights: 10,
  pinned_at: null,
  created_by: "admin@localhost.com",
  id: 1,
  created_at: "2025-02-25T15:26:12.383995",
  updated_at: null,
  steps: []
}

global.requestAnimationFrame = vi.fn()

const i18n = createI18n({
  legacy: false,
  locale: 'fr'
})

const mockRefresh = vi.fn()

mockNuxtImport('useToast', () => {
  return () => ({
    add: vi.fn()
  })
})

const mocks = vi.hoisted(() => ({
  deleteProject: vi.fn()
}))

vi.mock('~/api/generate/', async (importOriginal) => {
  const original = await importOriginal()
  return {
    ...original,
    ProjectService: {
      deleteProjectProjectProjectIdDelete: mocks.deleteProject
    },
  }
})

const mockStatus = reactive({
  hasRole: false
})

mockNuxtImport('useService', () => {
  return () => ({
    $application: {
      hasRole: vi.fn(() => mockStatus.hasRole),
      formatDate: vi.fn().mockReturnValue(''),
    }
  })
})

describe('MoleculeProjectCard component', () => {

  let wrapper: VueWrapper

  beforeEach(async () => {
    mockStatus.hasRole = false
    mocks.deleteProject.mockReset()
    mockRefresh.mockReset()

    wrapper = await mountSuspended(MoleculeProjectCard, {
      global: {
        plugins: [i18n],
        provide: {
          refreshProject: mockRefresh
        },
        stubs: {
          teleport: true
        }
      },
      props: {
        project: { ...mockedProject }
      }
    })
  })

  it('should have the right title', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain(mockedProject.title)
  })

  it('edit buttons should work', async () => {
    const editButton = wrapper.find('button[data-p-severity="secondary"]')
    await editButton.trigger('click')

    expect(wrapper.findComponent(Popover).exists()).toBeTruthy()
  })

  it('delete button should not be visible for non-admin', async () => {
    let deleteButton = wrapper.find('button[data-p-severity="error-state"]')
    expect(deleteButton.exists()).toBeFalsy()

    mockStatus.hasRole = true
    await wrapper.vm.$nextTick()

    deleteButton = wrapper.find('button[data-p-severity="error-state"]')
    expect(deleteButton.exists()).toBeTruthy()
  })

  it('delete button should show the dialog and call delete service', async () => {
    mockStatus.hasRole = true

    // remount with admin role
    wrapper = await mountSuspended(MoleculeProjectCard, {
      global: {
        plugins: [i18n],
        provide: { refreshProject: mockRefresh },
        stubs: { teleport: true }
      },
      props: { project: { ...mockedProject } }
    })

    const deleteButton = wrapper.get('button[data-p-severity="error-state"]')
    await deleteButton.trigger('click')

    const deleteDialog = wrapper.getComponent(Dialog)
    const confirmDeleteButton = deleteDialog.get('button[aria-label="common.yes"]')

    await confirmDeleteButton.trigger('click')

    expect(mocks.deleteProject).toHaveBeenCalledOnce()
    expect(mockRefresh).toHaveBeenCalledOnce()
  })

  it("should display error by calling error plugin", async () => {
    mockStatus.hasRole = true
    mocks.deleteProject.mockRejectedValue(new Error('ApiError'))

    wrapper = await mountSuspended(MoleculeProjectCard, {
      global: {
        plugins: [i18n],
        provide: { refreshProject: mockRefresh },
        stubs: { teleport: true }
      },
      props: { project: { ...mockedProject } }
    })

    const consoleMock = vi.spyOn(console, 'error')
    const deleteButton = wrapper.get('button[data-p-severity="error-state"]')
    await deleteButton.trigger('click')

    const deleteDialog = wrapper.getComponent(Dialog)
    const confirmDeleteButton = deleteDialog.get('button[aria-label="common.yes"]')

    await confirmDeleteButton.trigger('click')

    expect(consoleMock).toHaveBeenCalled()
  })
})
