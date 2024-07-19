import {defineStore} from 'pinia'

import {ProjectService} from '../api/generate'

export const useRefreshStore = defineStore('refresh', {
  state: () => {
    return {
      data: [],
    }
  },
  actions: {
    setData(newData) {
      //store works
      this.data = newData
    },
    async fetchProject() {
      ProjectService.readProjectsProjectsGet().then((response) => this.data = response).then(() => {}).catch((error) => (error))
    },
    async fetchTasks(projectid: number) {
      ProjectService.readProjectProjectProjectIdGet(projectid).then((response) => this.data = response).then(() => {}).catch((error) => (error))
    }
  },
  getters: {
    getData(state) {
      return state.data
    }
  }
})
