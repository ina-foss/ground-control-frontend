import type { ZodObject } from "zod"

const persistenceArray : Record<string,PersistenceManager<unknown>> = {}

export function usePersistence<T>(key: string,items: T, zodSchema?: ZodObject ) {

  if( !key || typeof key !== "string"){
    throw new Error("Persistence key must be a non-empty string")
  }

  if (!persistenceArray[key]){
    persistenceArray[key] = new PersistenceManager<T>(items, key, zodSchema)
  }
  return persistenceArray[key] as PersistenceManager<T>

}
