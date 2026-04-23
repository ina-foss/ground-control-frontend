import AmaliaPlayerService from "~/services/amalia-player-service"

let instance: AmaliaPlayerService | null = null
let initPromise: Promise<AmaliaPlayerService> | null = null

/**
 * @brief Composable that return the AmaliaPlayerService in a promise.
 * @example
 * const player = await usePlayer()
 * // or
 * usePlayer().then(player=>player.onplay())
 */
export const usePlayer = ((...params?)=>{
  // if called with parameters
  // create the instance and return it when ready
  if(params?.length){
    instance = new AmaliaPlayerService(...params);
    initPromise = instance.waitUntilServiceReady().then(()=>instance!)
    return instance;
  }

  // if instance already exists, just return it synchronously
  if (instance) return instance;

  // if no instance available
  // create a promise which resovle when usePlayer is called with parameters
  initPromise = new Promise<AmaliaPlayerService>((resolve)=>{
    const interval = setInterval(async()=>{
      if (instance){
        clearInterval(interval)
        await instance.waitUntilServiceReady()
        resolve(instance)
      }
    })
  })

  return initPromise
})
