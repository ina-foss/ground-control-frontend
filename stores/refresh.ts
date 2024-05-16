import { defineStore } from 'pinia'


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
            useFetch('http://localhost:8000/projects/').then( (response) => this.data = response.data ).then(() =>  console.log( this.data ) ).catch( (error) => console.log(error))
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