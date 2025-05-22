import PrimeVue from 'primevue/config';
import {expect, describe, it }  from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { mockNuxtImport} from "@nuxt/test-utils/runtime";
import { Button, Dialog, StepList,Stepper, StepPanels, Step, FileUpload} from 'primevue';
import MoleculeFormTask from '../../../components/molecules/MoleculeFormTask.vue';
import { TaskDataType, AnnotationService, TaskService, MediaService, TaskStatus, AnnotationStatus } from '~/api/generate';


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
                      "tasks": []
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

    vi.mock('~/api/generate/',async (importOrigial)=>{
      const original = await importOrigial()
      return {
        ...original,
        TaskService: {createTaskTaskPost: vi.fn().mockResolvedValue({id: 1}) },
        MediaService:  {createMediaMediaPost: vi.fn().mockResolvedValue({id: 2}) },
        AnnotationService: {createAnnotationAnnotationPost: vi.fn().mockResolvedValue({id: 3}) },
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
      await wrapper.findAll(`input`).at(1).setValue('Task instruction')

      const file = new File(['{"asset": {"url": "http://example.com", "media_type": "video", "player_parameters": {}}}'], 'test.json', { type: 'application/json' });
      const fileUpload = wrapper.findComponent(FileUpload);
      await fileUpload.vm.$emit('select', { files: [file] });

      // Wait for the file reader to populate the fileData array
      await new Promise(resolve => setTimeout(resolve, 500));
      await wrapper.vm.$nextTick()

      await wrapper.find('button[aria-label="Créer"]').trigger('click')
      expect(MediaService.createMediaMediaPost).toHaveBeenCalledOnce()
      expect(MediaService.createMediaMediaPost).toHaveBeenLastCalledWith({url: "http://example.com", type: "video", player_parameters: {}})
      expect(TaskService.createTaskTaskPost).toHaveBeenCalledOnce()
      expect(TaskService.createTaskTaskPost).toHaveBeenLastCalledWith({name: 'Task title',instruction:'Task instruction', data_type: TaskDataType.LDD, status: TaskStatus.DRAFT, lead_time: null, step_id: mockedStepObject.id, media_id: 2  })

      // Wait for all asynchronous operations to complete
      await flushPromises()

      expect(AnnotationService.createAnnotationAnnotationPost).toHaveBeenCalledOnce()
      expect(AnnotationService.createAnnotationAnnotationPost).toHaveBeenCalledWith({
      annotation:{
        user_email: 'user@localhost.com',
        annotation_status: AnnotationStatus.DRAFT,
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
    })

      expect(wrapper.emitted()).toHaveProperty('toggle-dialog')
      expect(wrapper.emitted()).toHaveProperty('refresh-data')
  })


})
