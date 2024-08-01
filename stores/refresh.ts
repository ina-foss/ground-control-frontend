import {defineStore} from 'pinia'

import {ProjectService, TaskService} from '../api/generate'

export const useRefreshStore = defineStore('refresh', {
  state: () => {
    return {
      data: [] as Record<string,any>,
      project: [] as Record<string,any>,
    }
  },
  actions: {
    setData(newData) {
      //store works
      this.data = newData
    },
    async fetchProject() {
      const res = await ProjectService.readProjectsProjectsGet()
      const data =  res
      this.data = data;

      return data
    },
    async fetchTasks(projectid: number) {
      const res = await ProjectService.readProjectProjectProjectIdGet(projectid)
      const data =  res
      this.project = data;

      return data
    },
    async fetchAnnotations(taskid: number){
      const res = await TaskService.readTaskTaskTaskIdGet(taskid)
      this.data = res
    }
  },
  getters: {
    getData(state) {
      return state.data
    },
    getProject(state){
      return state.project
    }
  }
})
