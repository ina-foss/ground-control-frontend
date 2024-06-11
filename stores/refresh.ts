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
    async fetch() {
      ProjectService.readProjectsProjectsGet().then((response) => this.data = response).then(() => {}).catch((error) => (error))
    }
  },
  getters: {
    getData(state) {
      return state.data
    }
  }
})
