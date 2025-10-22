import {expect, describe, it }  from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import MoleculeProjectCard from '~/components/molecules/MoleculeProjectCard.vue'
import MoleculeFormProject from '~/components/molecules/MoleculeFormProject.vue'
import { ProjectService } from '~/api/generate';
import { Dialog } from 'primevue';
import {OverlayPanel } from 'primevue';


let mockedProject = {title: "Project creation",
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

const mockRefresh = vi.fn()

  mockNuxtImport('useToast', () => {
    return ()=>{
      vi.fn()
    }
  })

const mocks = vi.hoisted(()=>{
  return {
    deleteProject : vi.fn()
  }
})

  vi.mock('~/api/generate/',async (importOrigial)=>{
    const original = await importOrigial()
    return {
      ...original,
      ProjectService: {deleteProjectProjectProjectIdDelete: mocks.deleteProject },
    }
  })

const mockStatus = reactive({
  hasRole: false
})

  mockNuxtImport('useService', ()=>{
    return ()=>{
      return {
      $application :{
        hasRole: vi.fn(()=>mockStatus.hasRole),
        formatDate: vi.fn().mockReturnValue(''),

      }}
    }
  })

describe('MoleculeProjectCard component', ()=>{

  let wrapper : VueWrapper


  beforeEach(  async ()=>{
    wrapper = await mountSuspended(MoleculeProjectCard,{
      global:{
        provide: {
          refreshProject: mockRefresh
        },
        stubs:{
          teleport: true
        }
      },
      props:{
        project: mockedProject
      }
    })
  })

  it('should have the right title',async () =>{
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text().includes(mockedProject.title))
  })

  it('edit buttons should work', async()=>{
    expect(wrapper.findComponent(MoleculeFormProject).exists()).toBeFalsy()
    const editButton = wrapper.find('button[data-p-severity="secondary"]')
    await editButton.trigger('click')

    expect(wrapper.findComponent(OverlayPanel).exists()).toBeTruthy()
    expect(wrapper.findComponent(OverlayPanel).isVisible()).toBeTruthy()

  })

  it('delete button should not be visible for non-admin', async()=>{
    let deleteButton = wrapper.find('button[data-p-severity="error-state"]')

    expect(deleteButton.exists()).toBeFalsy()

    mockStatus.hasRole = true
    await wrapper.vm.$nextTick()
    deleteButton = wrapper.find('button[data-p-severity="error-state"]')

    expect(deleteButton.exists()).toBeTruthy()
    expect(deleteButton.isVisible()).toBeTruthy()

  })

  it('delete button should show the dialog and call delete service', async()=>{
    let deleteDialog = wrapper.getComponent(Dialog)
    expect(deleteDialog.text()).toBe("")
    let deleteButton = wrapper.find('button[data-p-severity="error-state"]')
    await deleteButton.trigger('click')


    deleteDialog = wrapper.getComponent(Dialog)
    expect(deleteDialog.text()).not.toBe("")

    const confrimDeleteButton = deleteDialog.find('button[aria-label="Oui"]')

    await confrimDeleteButton.trigger('click')

    expect(ProjectService.deleteProjectProjectProjectIdDelete).toHaveBeenCalledOnce()
    expect(mockRefresh).toHaveBeenCalledOnce()
  })

  it("should display error by calling error plugin", async()=>{
    mocks.deleteProject.mockRejectedValue(new Error('ApiError'))
    const consoleMock = vi.spyOn(console,'error')

    let deleteButton = wrapper.find('button[data-p-severity="error-state"]')
    await deleteButton.trigger('click')
    let deleteDialog = wrapper.getComponent(Dialog)
    const confrimDeleteButton = deleteDialog.find('button[aria-label="Oui"]')
    await confrimDeleteButton.trigger('click')

    expect(consoleMock).toHaveBeenCalledTimes(2)


    mocks.deleteProject.mockRestore()

  })

  it('should display success tag', async()=>{
    let tag = wrapper.find('span[class~="p-tag-info"]')
    expect(tag.exists()).toBeTruthy()
    expect(tag.text()).toContain('Brouillon')

    mockedProject.status = "done"
    await wrapper.setProps({project:mockedProject})
    tag = wrapper.find('span[class~="p-tag-success"]')
    expect(tag.text()).toContain('Terminé')
    expect(tag.exists()).toBeTruthy()



  } )

  it('should display warn tag', async()=>{
    mockedProject.status = "pending"
    await wrapper.setProps({project:mockedProject})
    let tag = wrapper.find('span[class~="p-tag-warn"]')
    expect(tag.text()).toContain('En attente')
    expect(tag.exists()).toBeTruthy()

  } )

  it('should display in-progress tag', async()=>{
    mockedProject.status = "in-progress"
    await wrapper.setProps({project:mockedProject})
    let tag = wrapper.find('span[class~="p-tag-info"]')
    expect(tag.text()).toContain('En cours')
    expect(tag.exists()).toBeTruthy()


  } )

})
