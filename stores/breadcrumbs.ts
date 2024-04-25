import { defineStore } from 'pinia'

type Crumb = { label : string, url: string }

export const bcStore = defineStore('breadcrumbs', {
  state: () => ({
    items: [] as Crumb[]
  }),
  actions: {
    addCrumb(crumb: Crumb) {
      this.items.push(crumb)
    },
    removeLastCrumb() {
      this.items.pop()
    }
  }
})