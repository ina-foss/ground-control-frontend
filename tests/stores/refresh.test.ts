import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRefreshStore } from '@/stores/refresh'
import * as api from '@/api/generate'
import * as dynamicConfig from '@/services/dynamic-configuration-service'

vi.mock('@/stores/auth-store', () => ({
  useAuth: vi.fn()
}))

vi.mock('pinia', async (importOriginal) => {
  const mod = await importOriginal<any>()
  return {
    ...mod,
    storeToRefs: vi.fn(() => ({
      access_token: { value: 'GC-token' }
    }))
  }
})

vi.mock('../../api/generate', () => ({
  ProjectService: {
    readProjectsProjectsGet: vi.fn(),
    readProjectProjectProjectIdGet: vi.fn()
  },
  TaskService: {
    readTaskTaskTaskIdGet: vi.fn()
  }
}))

vi.mock('../../services/dynamic-configuration-service', () => ({
  getApplicationConfiguration: vi.fn()
}))

vi.stubGlobal('$fetch', vi.fn())

describe('useRefreshStore', () => {
  let store: ReturnType<typeof useRefreshStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useRefreshStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should set data correctly', () => {
    const data = [{id: 1}]
    store.setData(data)
    expect(store.data).toEqual(data)
  })

  it('should set project number correctly', () => {
    store.setProjectNumber(42)
    expect(store.project_number).toBe(42)
  })

  it('should fetch total records and update project_number', async () => {
    const mockData = [{}, {}, {}]
    vi.spyOn(api.ProjectService, 'readProjectsProjectsGet').mockResolvedValue(mockData)

    const total = await store.totalRecords()

    expect(api.ProjectService.readProjectsProjectsGet).toHaveBeenCalled()
    expect(store.project_number).toBe(3)
    expect(total).toBe(3)
  })

  it('should fetch tasks and update data', async () => {
    const mockTasks = [{ task: 'Task 1' }]
    vi.spyOn(api.ProjectService, 'readProjectProjectProjectIdGet').mockResolvedValue(mockTasks)

    const data = await store.fetchTasks(123)

    expect(api.ProjectService.readProjectProjectProjectIdGet).toHaveBeenCalledWith(123)
    expect(store.data).toEqual(mockTasks)
    expect(data).toEqual(mockTasks)
  })

  it('should fetch annotations and update data', async () => {
    const mockAnnotations = [{ annotation: 'Annotation 1' }]
    vi.spyOn(api.TaskService, 'readTaskTaskTaskIdGet').mockResolvedValue(mockAnnotations)

    const data = await store.fetchAnnotations(456)

    expect(api.TaskService.readTaskTaskTaskIdGet).toHaveBeenCalledWith(456)
    expect(store.data).toEqual(mockAnnotations)
    expect(data).toEqual(mockAnnotations)
  })

  it('should return correct getters', () => {
    const data = [{ id: 1 }]
    store.setData(data)
    store.setProjectNumber(5)

    expect(store.getData).toEqual(data)
    expect(store.getProject).toEqual(data)
    expect(store.getProjectNumber).toBe(5)
  })


  it('should handle onResponse and update project_number', async () => {
    setActivePinia(createPinia())
    store = useRefreshStore()
    vi.clearAllMocks()

    vi.mocked(dynamicConfig.getApplicationConfiguration).mockReturnValue({
      apiBasePath: 'https://GC-api'
    })

    const mockResponse = [{ id: 1 }]
    const $fetchMock = vi.fn().mockImplementation(async (_url, options) => {
      await options.onResponse({
        response: {
          headers: {
            get: (key: string) => (key === 'x-total-count' ? '123' : null)
          }
        }
      })
      return mockResponse
    })
    vi.stubGlobal('$fetch', $fetchMock)

    vi.stubGlobal('window', { innerWidth: 1920 })
    await store.fetchProject(0, 10)
    expect(store.project_number).toBe(123)

    vi.stubGlobal('window', { innerWidth: 1500 })
    await store.fetchProject()
    expect(store.project_number).toBe(123)
  })
})
