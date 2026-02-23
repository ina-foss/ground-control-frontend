const tcOffset = ref(0)

export function useTcOffset() {
    function getTcOffset() {
        return tcOffset.value;
    }
    function setTcOffset(newTcOffset:number) {
         tcOffset.value= newTcOffset;
    }
return{
    getTcOffset,
    setTcOffset,
}
}
