import { defineStore } from 'pinia'

import { ProjectService } from '../api/generate'

export const useRefreshStore = defineStore('refresh',{
    state: () => {
        return {
            data: [],
        }
    },
    actions:{
        setData(newData){
            console.log("store works")
            this.data = newData
            console.log(newData.value)
        },
        async fetch() {
            ProjectService.readProjectsProjectsGet().then( (response) => this.data = response ).then(() =>  console.log( this.data ) ).catch( (error) => console.log(error))
        }
    },
    getters: {
        getData(state) {
            console.log(state.data)
            // if(state.data.length != 0)
            return state.data
            // debugger
            
        }
    }
    

})