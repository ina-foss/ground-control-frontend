import {expect, describe, it }  from 'vitest'
import id from '../../pages/projects/[id].vue'
import type { VueWrapper } from '@vue/test-utils'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import { DataTable, Tag, Select, Button} from 'primevue';
import MoleculeFormTask from '~/components/molecules/MoleculeFormTask.vue';
import {TaskService} from '../../api/generate';


let mockedProjectView = ref({
  "title": "Project Auto-summary",
  "description": "",
  "status": "draft",
  "is_published": false,
  "empty_annotations": false,
  "allow_skip": true,
  "control_weights": 10,
  "pinned_at": null,
  "created_by": "user@localhost.com",
  "id": 1,
  "created_at": "2025-04-08T14:13:43.205059",
  "updated_at": null,
  "steps": [
    {
      "title": "Step #2",
      "description": "Step description",
      "annotation_type": "segmentation",
      "pinned_at": null,
      "status": "draft",
      "project_id": 1,
      "redundancy": 1,
      "completeness_rate": 100,
      "allow_empty_annotation": false,
      "max_tasks_per_person": 1,
      "id": 2,
      "created_at": "2025-04-09T09:04:04.366270",
      "updated_at": "2025-04-09T09:04:04.366270",
      "tasks": [
        {
          "name": "test",
          "instruction": "",
          "data_type": "ldd",
          "status": "draft",
          "lead_time": null,
          "step_id": 2,
          "media_id": 2,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 2,
          "annotations": []
        },
        {
          "name": "test audio",
          "instruction": "",
          "data_type": "ldd",
          "status": "draft",
          "lead_time": null,
          "step_id": 2,
          "media_id": 4,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 4,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "draft",
              "version": 1,
              "id": 12
            }
          ]
        },
        {
          "name": "tache video",
          "instruction": "",
          "data_type": "amalia",
          "status": "in-progress",
          "lead_time": null,
          "step_id": 2,
          "media_id": 8,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 8,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "in-progress",
              "version": 1,
              "id": 14
            }
          ]
        }
      ]
    },
    {
      "title": "Step #1",
      "description": "Step description",
      "annotation_type": "auto-summary",
      "pinned_at": null,
      "status": "done",
      "project_id": 1,
      "redundancy": 1,
      "completeness_rate": 100,
      "allow_empty_annotation": false,
      "max_tasks_per_person": 1,
      "id": 1,
      "created_at": "2025-04-08T14:13:43.314476",
      "updated_at": "2025-04-10T13:12:28.072253",
      "tasks": [
        {
          "name": "fichier alexandra",
          "instruction": "",
          "data_type": "ldd",
          "status": "done",
          "lead_time": null,
          "step_id": 1,
          "media_id": 1,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 1,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "done",
              "version": 1,
              "id": 5
            }
          ]
        },
        {
          "name": "hfklwe",
          "instruction": "",
          "data_type": "ldd",
          "status": "draft",
          "lead_time": null,
          "step_id": 1,
          "media_id": 6,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 6,
          "annotations": []
        },
        {
          "name": "submit ",
          "instruction": "",
          "data_type": "ldd",
          "status": "done",
          "lead_time": null,
          "step_id": 1,
          "media_id": 5,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 5,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "done",
              "version": 1,
              "id": 7
            }
          ]
        },
        {
          "name": "phrases ",
          "instruction": "",
          "data_type": "ldd",
          "status": "draft",
          "lead_time": null,
          "step_id": 1,
          "media_id": 11,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 11,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "in-progress",
              "version": 1,
              "id": 20
            }
          ]
        },
        {
          "name": "Test synchronisation timecode string",
          "instruction": "",
          "data_type": "amalia",
          "status": "draft",
          "lead_time": null,
          "step_id": 1,
          "media_id": 12,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 12,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "in-progress",
              "version": 1,
              "id": 23
            }
          ]
        },
        {
          "name": "resume avec timecode corriges",
          "instruction": "",
          "data_type": "amalia",
          "status": "draft",
          "lead_time": null,
          "step_id": 1,
          "media_id": 13,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 13,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "in-progress",
              "version": 1,
              "id": 25
            }
          ]
        }
      ]
    },
    {
      "title": "Step #4",
      "description": "Step description",
      "annotation_type": "span",
      "pinned_at": null,
      "status": "draft",
      "project_id": 1,
      "redundancy": 1,
      "completeness_rate": 100,
      "allow_empty_annotation": false,
      "max_tasks_per_person": 1,
      "id": 4,
      "created_at": "2025-04-16T14:33:40.003575",
      "updated_at": "2025-04-16T14:33:40.003575",
      "tasks": [
        {
          "name": "tache span",
          "instruction": "",
          "data_type": "ldd",
          "status": "draft",
          "lead_time": null,
          "step_id": 4,
          "media_id": 9,
          "documentation": "",
          "expiration_date": null,
          "redundancy": 1,
          "priority": 0,
          "id": 9,
          "annotations": [
            {
              "user_email": "user@localhost.com",
              "annotation_status": "in-progress",
              "version": 1,
              "id": 16
            }
          ]
        }
      ]
    },
    {
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
  ],
  "medias": []
})
const mockedRefresh = vi.fn()

describe('Project detail view',()=>{

  let wrapper: VueWrapper

  beforeAll(()=>{
    mockNuxtImport('useToast', () => {
        return ()=>{
          vi.fn()
        }
      })

      mockNuxtImport('useAsyncData', () => {
      return ()=>{
        return { data: mockedProjectView, refresh: mockedRefresh, status: 'success', error: undefined  }
      }
      })

    mockNuxtImport('useService', ()=>{
      return ()=>{
        return { $application :{
          hasRole: vi.fn().mockReturnValue(true)
        }}
      }
    })

    vi.mock('~/api/generate/',async (importOrigial)=>{
      const original = await importOrigial()
      return {
        ...original,
        TaskService: {deleteTaskTaskTaskIdDelete: vi.fn().mockResolvedValue({id: 1}) },
      }
    })
  })

  beforeEach(async()=>{
    wrapper = await mountSuspended(id,{
      global:{
        stubs: {
          teleport : true
        }
      }
    })
  })

  it('should mount itself',()=>{
    expect(wrapper.exists()).toBe(true)
  })

  it('Should mount the DataTable component',async ()=>{
    expect(wrapper.findComponent(DataTable).exists()).toBe(true)
    expect(wrapper.findAll("[data-pc-section='bodyrow']").length).toBe(4) // 1 row for each step in the mock data
  })

  it("should display the right step's info",()=>{
    // -- TAG SECTION --
    expect(wrapper.findAllComponents(Tag).length).toBe(4)
    expect(wrapper.findAllComponents(Tag).filter(tag=>tag.text().includes('Brouillon')).length).toBe(3)
    expect(wrapper.findAllComponents(Tag).filter(tag=>tag.text().includes('Terminé')).length).toBe(1)

    // -- ANNOTATION TYPE SECTION --
    expect(wrapper.text()).toContain('span')
    expect(wrapper.text()).toContain('segmentation')
    expect(wrapper.text()).toContain('transcription')
    expect(wrapper.text()).toContain('auto-summary')

  })

  it('should display the subDataTable',async ()=>{
    wrapper.find('[class="p-datatable-row-toggle-button"]').trigger('click')
    await nextTick()
    expect(wrapper.find('[class="p-datatable-row-toggle-button"]').exists()).toBe(true)
    expect(wrapper.findAllComponents(Tag).length).toBe(7)
  })

  it('should be able to filter steps',async ()=>{
    const select = wrapper.findComponent(Select)
    expect(select.exists()).toBe(true)

    // filtrer les step terminée
    select.vm.$emit('update:model-value',{ value:'done'})
    await nextTick()
    expect(wrapper.findComponent(DataTable).exists()).toBe(true)
    expect(wrapper.findAllComponents(Tag).length).toBe(1)

    // filtrer les step brouillone
    select.vm.$emit('update:model-value',{ value:'draft'})
    await nextTick()
    expect(wrapper.findComponent(DataTable).exists()).toBe(true)
    expect(wrapper.findAllComponents(Tag).length).toBe(3)

  })

  it('can open the task form',async()=>{
    // There is no form open yet
    expect(wrapper.findAllComponents(MoleculeFormTask).length).toBe(0)

    // Click on the button to create a new task
    await wrapper.findComponent(Button).trigger('click')

    // Check if the Form component has been mounted
    expect(wrapper.findAllComponents(MoleculeFormTask).length).toBe(1)
  })

  it('should filter the expanded table on title', async ()=>{
    //Expand the 1st step DataTable
    await wrapper.find('[class="p-datatable-row-toggle-button"]').trigger('click')

    // Filter task by title 'test'
    await wrapper.find('input').setValue('test')

    // chekc if the filter works
    expect(wrapper.findAllComponents(DataTable)[1].text()).toContain('test')
    expect(wrapper.findAllComponents(DataTable)[1].text()).toContain('test audio')
    expect(wrapper.findAllComponents(DataTable)[1].text()).not.toContain('tache video')

  })

})
