import {ref} from 'vue'
import type { AnnotationType } from '~/api/generate'

type AnnotationTypeHandler<T = any> = {
  formatForSave: (data: any, block: any, meta: SaveMeta) => any
}

type SaveMeta = {timeSpent?: number, topicList: any[], topics? : number[]}

const registry = ref<Record<string, AnnotationTypeHandler>>({})

function getHandlerName(annotation_type: AnnotationType, block_type: string ) {
  // difference of format for the same block (transcription) regarding the annotation type
  return block_type == "transcription" ? annotation_type : block_type
}

/**
 * @brief Function to aggregate current stored annotations and send it to database
*/
export function patchDataBeforeSaving(d: any[], annotation_type: AnnotationType,timeSpent?: number) {
  // perform init function that should only run once
  const listInitHanlder = Object.keys(registry.value).filter(handlerName => handlerName.startsWith('init'))
  listInitHanlder.forEach(handlerName=>{
    const handler = getHandler(handlerName)
    if(handler) d = handler.formatForSave(d,{},{})
  })

  // use each associatied function per metadata block
  return d.map(block => {
    const handlerName = getHandlerName(annotation_type,block.type)
    const handler = getHandler(handlerName)
    const locals = block.localisation[0].sublocalisations.localisation
    if (!handler || !locals) return block
    return handler.formatForSave(locals, block, { timeSpent })
  })

}

export const useAnnotationTypeRegistry = () => {
  const registerAnnotationType = (type: string, handler: AnnotationTypeHandler) => {
    registry.value[type] = handler
  }

  return registerAnnotationType
}

export const getHandler = (type:string) => {
  let result = registry.value[type]
  if (!result) result = Object.entries(registry.value).find(([key]) => type.includes(key))?.[1]
  return result
}
