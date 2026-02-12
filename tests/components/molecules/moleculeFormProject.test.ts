import {expect, describe, it }  from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mockNuxtImport, mountSuspended} from "@nuxt/test-utils/runtime";
import { Button, InputText} from 'primevue';
import { StepService } from '~/api/generate';
import MoleculeFormProject from '../../../app/components/molecules/MoleculeFormProject.vue';
import { flushPromises } from '@vue/test-utils';

let mockedProject = {title: "Project creation",
      description: "test",
      status: "draft",
      is_published: false,
      empty_annotations: true,
      allow_skip: true,
      control_weights: 10,
      pinned_at: null,
      created_by: "admin@localhost.com",
      id: 1,
      created_at: "2025-02-25T15:26:12.383995",
      updated_at: null,
      steps: [{ annotation_type: 'span' },{annotation_type:'segmentation'}]
}

mockNuxtImport('useAuth',()=>{
  return () =>{
    return {userEmail : 'user'}
  }
})

const consoleMock = vi.spyOn(console,'error')


mockNuxtImport('useToast', () => {
  return () => ({
    add:vi.fn((message)=>console.error(message.detail)),
  });
});

const mockProjectFetch = vi.fn().mockResolvedValue({data: [mockedProject], refresh: vi.fn(), status: 'success', error: undefined})
mockNuxtImport('useAsyncData', () => {
  return ()=>{
    return mockProjectFetch()
  }
})


const mocks = vi.hoisted(()=>{
  return {
    projectFetch: vi.fn(),
    createStepStepPost: vi.fn().mockResolvedValue({id:3}),
    createProjectProjectPost: vi.fn(),
    updateProjectProjectProjectIdPut: vi.fn()

  }
})

vi.mock('~/api/generate/',async (importOrigial)=>{
  const original = await importOrigial()
  return {
    ...original,
    StepService: {
      createStepStepPost: mocks.createStepStepPost,
    },
    ProjectService:  {
      createProjectProjectPost: mocks.createProjectProjectPost,
      updateProjectProjectProjectIdPut: mocks.updateProjectProjectProjectIdPut,
    },
  }
})

describe('Molecule Form Project for new Project', ()=>{
  let wrapper : VueWrapper

  beforeEach(async()=>{
    consoleMock.mockClear()
    mocks.createStepStepPost.mockClear()
    mocks.createProjectProjectPost.mockClear()
    mocks.updateProjectProjectProjectIdPut.mockClear()

    wrapper = await mountSuspended(MoleculeFormProject,{
      global:{
        stubs:{
          teleport: true
        }
      },
      props:{
        dialogVisible: true
      }
    })
  })

  it('should mount itself', ()=>{
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Nouveau projet')

  })

  it('should disappear if props change', async()=>{
    wrapper = await mountSuspended(MoleculeFormProject,{
      global:{
        stubs:{
          teleport: true
        }
      },
      props:{
        dialogVisible: false
      }
    })

    expect(wrapper.text()).not.toContain('Nouveau projet')

  })

  it('should emit event when the dialog close', async()=>{
    const closeButton = wrapper.findComponent(Button)

    await closeButton.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('toggle-dialog')

  })

  it('should be able to navigate inside Stepper',async()=>{
    // pas de style applique = visible
    expect(wrapper.find('[id$="steppanel_1"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[id$="steppanel_2"]').attributes('style')).toContain('display: none')

    const nextButton = wrapper.findAllComponents(Button).at(1)
    await nextButton.trigger('click')

    expect(wrapper.find('[id$="steppanel_2"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[id$="steppanel_1"]').attributes('style')).toContain('display: none')

    const prevButton = wrapper.findAllComponents(Button).at(2)
    expect(prevButton.text()).toContain('Précédent')
    await prevButton.trigger('click')

    expect(wrapper.find('[id$="steppanel_1"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[id$="steppanel_2"]').attributes('style')).toContain('display: none')
  })

  it('should be able to create project ', async()=>{
    mocks.createProjectProjectPost.mockReset()
    mocks.createProjectProjectPost.mockResolvedValue({id: 5})

    // Fill in the form fields
    const inputs = wrapper.findAllComponents(InputText)
    await inputs.at(0).setValue("Title test")  // title
    await inputs.at(1).setValue("Description test")  // description

    // Navigate to step 2
    const nextButton1 = wrapper.findAllComponents(Button).at(1)
    await nextButton1.trigger('click')
    await wrapper.vm.$nextTick()

    // Navigate to step 3 to select types
    const nextButton2 = wrapper.findAllComponents(Button).at(1)
    await nextButton2.trigger('click')
    await wrapper.vm.$nextTick()

    // Select types using Listbox component
    const listbox = wrapper.findComponent({name: 'Listbox'})
    await listbox.vm.$emit('update:modelValue', ['span', 'segmentation'])
    await wrapper.vm.$nextTick()

    // Click create button
    const createButton = wrapper.findAllComponents(Button).at(5)
    await createButton.trigger('click')
    await flushPromises()

    expect(mocks.createProjectProjectPost).toHaveBeenCalledWith({
      title:"Title test",
      description: "Description test",
      allow_skip: true,
      control_weights: 10,
      created_by: 'user',
      empty_annotations: true,
      is_published: false,
      pinned_at: null,
      status: "draft",
    })
    expect(StepService.createStepStepPost).toHaveBeenCalledTimes(2)
    expect(StepService.createStepStepPost).toHaveBeenCalledWith(
       expect.objectContaining({
            title: `Step #1`,
            description: 'Step description',
            annotation_type: 'span',
            pinned_at: null,
            status: 'draft',
            project_id: 5,
            redundancy: 1,
            completeness_rate: 100.0,
            allow_empty_annotation: true,
            max_tasks_per_person: 1
    }))

  })

  it('should trigger title missing error ', async()=>{
    const createButton = wrapper.findAllComponents(Button).at(5)
    expect(createButton.text()).toContain('Créer')

    await createButton.trigger('click')
    // expect toast erro to be trigger
    expect(consoleMock).toHaveBeenCalledWith("Le titre est requis")
  })

  it('should trigger project error if call fails ', async()=>{
    // Fill in the form fields
    const inputs = wrapper.findAllComponents(InputText)
    await inputs.at(0).setValue("Title test")
    await inputs.at(1).setValue("Description test")

    // Navigate to step 3
    const nextButton1 = wrapper.findAllComponents(Button).at(1)
    await nextButton1.trigger('click')
    const nextButton2 = wrapper.findAllComponents(Button).at(1)
    await nextButton2.trigger('click')

    // Select types
    const listbox = wrapper.findComponent({name: 'Listbox'})
    await listbox.vm.$emit('update:modelValue', ['span', 'segmentation'])

    mocks.createProjectProjectPost.mockReset()
    mocks.createProjectProjectPost.mockRejectedValue(new Error('custom error'))

    const createButton = wrapper.findAllComponents(Button).at(5)
    await createButton.trigger('click')
    await flushPromises()
    expect(consoleMock).toHaveBeenLastCalledWith("🚨 API Error Caught:",new Error("custom error"))
  })

  it('should trigger step error if call fails ', async()=>{
    // Fill in the form fields
    const inputs = wrapper.findAllComponents(InputText)
    await inputs.at(0).setValue("Title test")
    await inputs.at(1).setValue("Description test")

    // Navigate to step 3
    const nextButton1 = wrapper.findAllComponents(Button).at(1)
    await nextButton1.trigger('click')
    const nextButton2 = wrapper.findAllComponents(Button).at(1)
    await nextButton2.trigger('click')

    // Select types
    const listbox = wrapper.findComponent({name: 'Listbox'})
    await listbox.vm.$emit('update:modelValue', ['span', 'segmentation'])

    mocks.createProjectProjectPost.mockReset()
    mocks.createProjectProjectPost.mockResolvedValue({id: 10, catch: vi.fn() })
    mocks.createStepStepPost.mockReset()
    mocks.createStepStepPost.mockRejectedValue(new Error('error step'))

    const createButton = wrapper.findAllComponents(Button).at(5)
    await createButton.trigger('click')
    await flushPromises()
    expect(consoleMock).toHaveBeenLastCalledWith("🚨 API Error Caught:",new Error('error step'))

  })
})

describe('Molecule Form Project for existing Project', ()=>{
  let wrapper : VueWrapper

  beforeEach(async()=>{
    consoleMock.mockClear()
    mocks.createStepStepPost.mockClear()
    mocks.createProjectProjectPost.mockClear()
    mocks.updateProjectProjectProjectIdPut.mockClear()

    wrapper = await mountSuspended(MoleculeFormProject,{
      global:{
        stubs:{
          teleport: true
        }
      },
      props:{
        project: mockedProject,
        dialogVisible: true
      }
    })
  })

  it('should mount itself', ()=>{
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.text()).toContain('Modifier')

  })

  it('should display project info if edit mode', async()=>{
    const inputs = wrapper.findAllComponents(InputText)
    expect(inputs.at(0).element.value).toBe(mockedProject.title)
    expect(inputs.at(1).element.value).toBe(mockedProject.description)

    // Navigate to step 2
    const nextButton1 = wrapper.findAllComponents(Button).at(1)
    await nextButton1.trigger('click')

    // Navigate to step 3 to check selected types
    const nextButton2 = wrapper.findAllComponents(Button).at(1)
    await nextButton2.trigger('click')

    // Check that the listbox has the correct selected values
    const listbox = wrapper.findComponent({name: 'Listbox'})
    expect(listbox.props('modelValue')).toContain('span')
    expect(listbox.props('modelValue')).toContain('segmentation')
  })

  it('should be able to update project ', async()=>{
    const createButton = wrapper.findAllComponents(Button).at(5)
    expect(createButton.text()).toContain('Sauvegarder')

    // Navigate to step 3 to modify types
    const nextButton1 = wrapper.findAllComponents(Button).at(1)
    await nextButton1.trigger('click')
    const nextButton2 = wrapper.findAllComponents(Button).at(1)
    await nextButton2.trigger('click')

    // Add more types
    const listbox = wrapper.findComponent({name: 'Listbox'})
    await listbox.vm.$emit('update:modelValue', ['span', 'segmentation', 'auto-summary', 'transcription'])
    mocks.updateProjectProjectProjectIdPut.mockReset()
    mocks.updateProjectProjectProjectIdPut.mockResolvedValue({id: 8})
    mocks.createStepStepPost.mockReset()
    mocks.createStepStepPost.mockResolvedValue({id: 8})

    await createButton.trigger('click')
    await flushPromises()
    expect(mocks.updateProjectProjectProjectIdPut).toHaveBeenCalledWith(
      mockedProject.id,
      {
        title: mockedProject.title,
        description: mockedProject.description,
        is_published: mockedProject.is_published,
        empty_annotations: mockedProject.empty_annotations,
        allow_skip: mockedProject.allow_skip,
        control_weights: mockedProject.control_weights,
        pinned_at: mockedProject.pinned_at,
        created_by: "user",
  })
    expect(mocks.createStepStepPost).toHaveBeenCalledTimes(2)
    expect(mocks.createStepStepPost).toHaveBeenCalledWith({
            title: `Step #3`,
            description: 'Step description',
            annotation_type: 'auto-summary',
            pinned_at: null,
            status: 'draft',
            project_id: 8,

    })

  })

  it('should trigger title missing error ', async()=>{
    // Clear the title field
    const inputs = wrapper.findAllComponents(InputText)
    await inputs.at(0).setValue("")

    const createButton = wrapper.findAllComponents(Button).at(5)
    await createButton.trigger('click')
    expect(consoleMock).toHaveBeenLastCalledWith('Le titre est requis')

  })

  it('should trigger project error if call fails ', async()=>{
    mocks.updateProjectProjectProjectIdPut.mockReset()
    mocks.updateProjectProjectProjectIdPut.mockRejectedValue(new Error('custom error'))

    const createButton = wrapper.findAllComponents(Button).at(5)
    await createButton.trigger('click')
    await flushPromises()
    expect(consoleMock).toHaveBeenLastCalledWith("🚨 API Error Caught:",new Error("custom error"))
  })

  it('should trigger step error if call fails ', async()=>{
    // Navigate to step 3 to add a new type
    const nextButton1 = wrapper.findAllComponents(Button).at(1)
    await nextButton1.trigger('click')
    const nextButton2 = wrapper.findAllComponents(Button).at(1)
    await nextButton2.trigger('click')

    // Add a new type
    const listbox = wrapper.findComponent({name: 'Listbox'})
    await listbox.vm.$emit('update:modelValue', ['span', 'segmentation', 'auto-summary'])
    mocks.updateProjectProjectProjectIdPut.mockReset()
    mocks.updateProjectProjectProjectIdPut.mockResolvedValue({id: 10, catch: vi.fn() })
    mocks.createStepStepPost.mockReset()
    mocks.createStepStepPost.mockRejectedValue(new Error('error step'))

    const createButton = wrapper.findAllComponents(Button).at(5)
    await createButton.trigger('click')
    await flushPromises()
    expect(consoleMock).toHaveBeenLastCalledWith("🚨 API Error Caught:",new Error('error step'))

  })
})


