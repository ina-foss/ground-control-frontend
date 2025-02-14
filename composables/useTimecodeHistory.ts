
type Timecode = number | string

const timecodeHistory = ref<Timecode[]>([])
const maxLength = 10

export default function useTimecodeHistory() {



function consumeTimecode(index?:any): Timecode {
  if(timecodeHistory){
    if(index != undefined){
      timecodeHistory.value.splice(index+1,timecodeHistory.value.length-index-1)
    }
    else{
      timecodeHistory.value.pop() // remove last timecode
    }
    const tc = timecodeHistory.value[timecodeHistory.value.length-1] // use the new last timecode to update the player
    return tc
  }
}

  function addTimecodeHistory (tc?: any){
    if(timecodeHistory.value.length == 0 || timecodeHistory.value[timecodeHistory.value.length-1] != tc){
      if( timecodeHistory.value.length < maxLength ){
        timecodeHistory.value.push(tc)
      }
      else{
        timecodeHistory.value = timecodeHistory.value.map((unused, index)=>{
          return index == maxLength-1 ? tc :  timecodeHistory.value[index+1]
        })
      }
    }
  }

  const getHistory = computed(()=>{
    return timecodeHistory.value
  })

  return {
    addTimecodeHistory,
    consumeTimecode,
    getHistory,
  }


}
