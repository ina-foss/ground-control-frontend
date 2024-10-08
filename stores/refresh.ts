import {defineStore} from 'pinia'

import {ProjectService, TaskService} from '../api/generate'
import { clamp } from 'lodash'

export const useRefreshStore = defineStore('refresh', {
  state: () => {
    return {
      data: [] as Record<string,any>,
      project: [] as Record<string,any>,
      project_number: 0 as number,
      last_index: 0 as number,
    }
  },
  actions: {
    setData(newData) {
      //store works
      this.data = newData
    },
    async totalRecords(){
      const res = await ProjectService.readProjectsProjectsGet()
      const data =  res
      this.project_number = data.length

      return data.length;
    },
    async fetchProject(skip: number, limit: number) {
      const default_limit = 15
      const res = await ProjectService.readProjectsProjectsGet((skip == undefined ? this.last_index : skip), limit || default_limit)
      if(skip != undefined) this.last_index = skip
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
    },
    getProjectNumber(state){
      return state.project_number
    }
  }
})
