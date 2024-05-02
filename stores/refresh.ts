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
            try{
                let {data} = await useFetch('http://localhost:8000/projects/')
                this.data = data
                console.log(this.data)
            }
            catch (error){
                console.error()
            }
        }
    },
    getters: {
        getData(state) {
            return state.data
        }
    }
    

})