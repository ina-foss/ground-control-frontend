import { defineStore } from 'pinia'

type Crumb = { label : string, url: string }

export const bcStore = defineStore('breadcrumbs', {
  state: () => {
    return {
    items: [] as Crumb[]
  }},
  actions: {
    addCrumb(crumb: Crumb) {
      this.items.push(crumb)
    },
    removeLastCrumb() {
      this.items.pop()
    }
  },
  getters: {
    getItems(state ){
      return state.items
    }
  }
})
