import {expect, describe, it,vi }  from 'vitest'
import Dashboard from '../../app/pages/dashboard.vue'
import MoleculeProjectCard from '~/components/molecules/MoleculeProjectCard.vue'
import MoleculeFooter from '~/components/molecules/MoleculeFooter.vue'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { Paginator, Select, Skeleton} from 'primevue'
import { mockedProject as project } from '../mock'
import { createI18n } from 'vue-i18n'

const mockedProject = ref(project)
const mockedProjectLenght = ref(mockedProject.value.length)
const refreshStatus = ref("success")

vi.mock('@/stores/refresh',()=>({
  useRefreshStore : vi.fn(()=>{
    return {
      getProjectNumber: mockedProjectLenght,
    }
  })
}))
const refreshProject = vi.fn()
let wrapper : VueWrapper
const i18n = createI18n({
  legacy: false,
  locale: 'fr'
})

mockNuxtImport('useToast', () => {
  return ()=>{
    vi.fn()
  }
})

const mockState = reactive({
  hasRole:true,
})

mockNuxtImport('useService',()=>{
  return ()=>{
      return {
        $application: {
          hasRole: vi.fn(()=>mockState.hasRole),
          formatDate: vi.fn().mockReturnValue(''),
        }
    }
  }
})

  mockNuxtImport('useAsyncData', () => {
    return  (key) => {
      if(key === "projects-summary"){
        return { data: mockedProject, refresh: refreshProject, status: refreshStatus, error: undefined  }
      }
      else if( key === "total_project_number"){
        return { data: mockedProjectLenght, refresh: vi.fn() }
      }
      return {data: null, refresh: vi.fn()}
    }
  })
describe('dashboard.vue', () => {

  beforeEach(async()=>{
    wrapper = await mountSuspended(Dashboard,{
    global: {
      plugins: [i18n],
      stubs: { teleport: true },
    }
  })
  })

  it('can mount dashboard', async () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('')
    expect(wrapper.findComponent(Paginator).isVisible()).toBeFalsy()
  })


  it("renders the Footer component",async ()=>{
    expect(wrapper.findComponent(MoleculeFooter).exists()).toBe(true)
  })

  it('should display project', async () => {
    expect(wrapper.findComponent(MoleculeProjectCard).exists()).toBe(true)
    expect(wrapper.findAllComponents(MoleculeProjectCard).length).toBe(2)
  })

  it('should change according to user role',async ()=>{
    expect(wrapper.vm.roleCreateProject).toBe(true)
    expect(wrapper.html()).toContain('right-[145px]')

    mockState.hasRole = false
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.roleCreateProject).toBe(false)
    expect(wrapper.html()).toContain('right-[5px]')

  })
  ,
  it('should change the max number of project on window size', async ()=>{
    expect(wrapper.vm.paginatorSize).toBe(16) // default value
    global.innerWidth = 2600
    global.dispatchEvent(new Event('resize')) // change window width
    wrapper = await mountSuspended(Dashboard)
    expect(wrapper.vm.paginatorSize).toBe(20)

    global.innerWidth = 1600 // reset for following tests
    global.dispatchEvent(new Event('resize'))
  })

})


describe('Paginator', () => {
  beforeEach(async()=>{
    mockedProjectLenght.value = 32
    wrapper = await mountSuspended(Dashboard)
  })


  it('should be visible', async ()=>{
    const paginator = wrapper.findComponent(Paginator)
    expect(paginator.exists()).toBeTruthy()
    expect(paginator.isVisible()).toBeTruthy()

  })

  it('should trigger the project fetching ', async ()=>{
    const paginator = wrapper.findComponent(Paginator)
    expect(refreshProject).not.toHaveBeenCalled()
    await paginator.find('button[class="p-paginator-next"]').trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(paginator.props('first')).toBe(16)
    expect(refreshProject).toHaveBeenCalled()

  })

  })

  describe("Project filter", ()=>{

  beforeEach(async()=>{
    mockedProjectLenght.value = mockedProject.value.length
    wrapper = await mountSuspended(Dashboard)
  })

    it('should be visible',async ()=>{
      const selectWrapper = wrapper.findComponent(Select)
      expect(selectWrapper.exists()).toBeTruthy()
      expect(selectWrapper.isVisible()).toBeTruthy()

    })

     it('should filter project on status', async ()=>{
      const selectWrapper = wrapper.findComponent(Select)
      await selectWrapper.setValue({label:'En attente', value: 'pending'})

      expect(wrapper.findAllComponents(MoleculeProjectCard).length).toBe(1)
    })
  })

  describe('Skeleton', ()=>{

   beforeEach(async()=>{
      refreshStatus.value = 'pending'
      mockedProject.value = []
      wrapper = await mountSuspended(Dashboard)
    })

    it("should render during project fetching", async () => {
      expect(wrapper.findComponent(Skeleton).exists()).toBeTruthy()
    })
})
