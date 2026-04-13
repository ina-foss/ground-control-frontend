import PrimeVue from 'primevue/config';
import {expect, describe, it, vi }  from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { mockNuxtImport} from "@nuxt/test-utils/runtime";
import { Button, Dialog, StepList,Stepper, StepPanels, Step, FileUpload} from 'primevue';
import MoleculeFormTask from '~/components/molecules/MoleculeFormTask.vue';


const mockedStepObject = {
                      "title": "Step #3",
                      "description": "Step description",
                      "annotation_type": "transcription",
                      "pinned_at": null,
                      "status": "draft",
                      "project_id": 1,
                      "redundancy": 1,
                      "completeness_rate": 100,
                      "allow_empty_annotation": false,
                      "max_tasks_per_person": 1,
                      "id": 3,
                      "created_at": "2025-04-09T14:44:37.700049",
                      "updated_at": "2025-04-09T14:44:37.700049",
                      "tasks": [],
                      "expiration_date" : "2025-04-09T14:44:37.700049"
                    }

describe('Molecule Form Task',()=>{

  let wrapper: VueWrapper

  beforeAll(()=>{
    mockNuxtImport('useToast', () => {
        return ()=>{
          vi.fn()
        }
    })

    mockNuxtImport('useAuth',()=>{
      return ()=>{
        return {userEmail: ref('user@localhost.com')}
      }
    })

    vi.mock('~/api/generate/sdk.gen',async (importOrigial)=>{
      const original = await importOrigial()
      return {
        ...original,
        Task: {createTaskTaskPost: vi.fn().mockResolvedValue({id: 1}) },
        Media:  {createMediaMediaPost: vi.fn().mockResolvedValue({id: 2}) },
        Annotation: {createAnnotationAnnotationPost: vi.fn().mockResolvedValue({id: 3}) },
      }
    })
  })

  beforeEach(async()=>{
    wrapper =  mount(MoleculeFormTask,{
      global: {
        stubs: {
          teleport: true,
        },
       plugins: [PrimeVue],
       components: {
       Dialog,
       Stepper,
       StepList,
        FileUpload,
       Step,
       StepPanels,
       },
       },
      props:{
        dialogVisible: true,
        stepObject: mockedStepObject
      },
    })
  })

  it('should mount',async ()=>{
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.findComponent(FileUpload).exists()).toBeTruthy()
    expect(wrapper.findAllComponents(Button).length).toBe(5)
    expect(wrapper.text()).toContain('Nouvelle')
  })

  it('click the create button', async ()=>{
      await wrapper.find('input').setValue('Task title')
      await wrapper.find('textarea').setValue('Task instruction')

      const file = new File(['{"asset": {"url": "http://example.com", "media_type": "video", "player_parameters": {}}}'], 'test.json', { type: 'application/json' });
      const fileUpload = wrapper.findComponent(FileUpload);
      await fileUpload.vm.$emit('select', { files: [file] });

      // Wait for the file reader to populate the fileData array
      await new Promise(resolve => setTimeout(resolve, 500));
      await wrapper.vm.$nextTick()

      await wrapper.find('button[aria-label="Créer"]').trigger('click')
      expect(Media.createMediaMediaPost).toHaveBeenCalledOnce()
      expect(Media.createMediaMediaPost).toHaveBeenLastCalledWith({body:{url: "http://example.com", type: "video", player_parameters: {}}})
      expect(Task.createTaskTaskPost).toHaveBeenCalledOnce()
      expect(Task.createTaskTaskPost).toHaveBeenLastCalledWith({body:{name: 'Task title',
        expiration_date : null, instruction:'Task instruction', data_type: TaskDataType.AMALIA, status:Status.DRAFT, lead_time: null, step_id: mockedStepObject.id, media_id: 2  }})

      // Wait for all asynchronous operations to complete
      await flushPromises()

      expect(Annotation.createAnnotationAnnotationPost).toHaveBeenCalledOnce()
      expect(Annotation.createAnnotationAnnotationPost).toHaveBeenCalledWith({body:{
      annotation:{
        user_email: 'user@localhost.com',
        annotation_status: Status.DRAFT,
        version: 0,
        result: {
          asset : {
            url : "http://example.com",
            player_parameters : {},
            media_type : "video"
          }
        },
        task_id : 1
      },
      association: {
        annotation_id: 0,
        task_id : 1,
        direction: 'in'
      }
    }})

      expect(wrapper.emitted()).toHaveProperty('toggle-dialog')
      expect(wrapper.emitted()).toHaveProperty('refresh-data')
  })


})
