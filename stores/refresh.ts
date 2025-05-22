import {defineStore} from 'pinia'

import {ProjectService, TaskService} from '../api/generate'
import { getApplicationConfiguration } from '~/services/dynamic-configuration-service'



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
    setProjectNumber(newNumber:number){
      this.project_number = newNumber
    },
    async totalRecords(){
      const res = await ProjectService.readProjectsProjectsGet()
      const data =  res
      this.project_number = data.length

      return data.length;
    },
    async fetchProject(skip: number, limit: number) {
      const default_limit = window.innerWidth > 1600 ? 20 : 16
      const { access_token } = storeToRefs(useAuth())
      const res = await $fetch(`${getApplicationConfiguration()['apiBasePath']}/projects`,{
          query: {skip:  skip  ?? this.last_index , limit: limit ?? default_limit  },
          headers: {Authorization: 'Bearer ' + access_token.value },
          raw: true,
          method: 'get',
          async onResponse({response}){
            if(response.headers.get('x-total-count') != null) useRefreshStore().setProjectNumber(parseInt(response.headers.get('x-total-count')))
          }
        })

      if(skip != undefined) this.last_index = skip
      const data =  res
      this.data = data;

      return data
    },
    async fetchTasks(projectid: number) {
      const res = await ProjectService.readProjectProjectProjectIdGet(projectid)
      const data =  res
      this.data = data;

      return data
    },
    async fetchAnnotations(taskid: number){
      const res = await TaskService.readTaskTaskTaskIdGet(taskid)
      this.data = res
      return res
    }
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
    }
  }
})
