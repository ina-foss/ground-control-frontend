import {defineStore} from 'pinia'
import { Project, Task } from '~/api/generate'

interface ProjectParametersResponse {
  redundancy: number
  completeness_rate: number
  allow_empty_annotation: boolean
  max_tasks_per_person: number
  allow_skip: boolean
}

export const useRefreshStore = defineStore('refresh', {
  state: () => {
    return {
      data: [] as Record<string,any>,
      project: [] as Record<string,any>,
      tasks: [],
      project_number: 0 as number,
      last_index: 0 as number,
      strategy_parameters: {
        redundancy: 1,
        completeness_rate: 100,
        allow_empty_annotation: true,
        max_tasks_per_person: 1,
        allow_skip: true,
      } as ProjectParametersResponse,
    }
  },
  actions: {
    setData(newData) {
      //store works
      this.data = newData
    },
    setProjectNumber(newNumber:number | null){
      if(!newNumber) throw new TypeError("newNumber should be a valid number")
      this.project_number = newNumber
    },
    setParameters(newParams: Partial<ProjectParametersResponse>) {
      this.strategy_parameters = { ...this.strategy_parameters, ...newParams }
    },
    async fetchProjects(skip: number, limit: number) {
      const default_limit = window.innerWidth > 1600 ? 20 : 16
      const { access_token } = storeToRefs(useAuth())
      const res = await client.get({
        query: {
          skip: skip ?? this.last_index,
          limit: limit ?? default_limit,
        },
        url: '/projects/summary',
        headers: { Authorization: `Bearer ${access_token.value}` },
        onResponse: (context) => {
          if (context.response.headers.get('x-total-count') != null)
            useRefreshStore().setProjectNumber(
              parseInt(context.response.headers.get('x-total-count')),
            );
        },
      });

      if(skip != undefined) this.last_index = skip
      const data =  res
      this.data = data;

      return data
    },
    async fetchTasks(projectid: number) {
      const res = await Project.readProjectProjectProjectIdGet({path:{project_id : projectid}})
      const data =  res
      const tasks = (data.steps || [])
        .flatMap((step: any) => step.tasks || [])

      this.tasks = tasks
      this.data = data;

      return data
    },
    async fetchAnnotations(taskid: number){
    const res = await Task.readTaskTaskTaskIdGet({path:{task_id: taskid}})
      this.data = res
      return res
    },
  },
  getters: {
    getData(state) {
      return state.data
    },
    getProject(state){
      return state.data
    },
    getProjectNumber(state){
      return state.project_number
    },
    getParameters: (state) => state.strategy_parameters,
    getTasks: (state) => state.tasks
  }
})
