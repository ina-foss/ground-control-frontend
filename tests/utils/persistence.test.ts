import { describe, vi, it, beforeEach, expect, afterEach } from 'vitest'
import {PersistenceManager} from '../../app/utils/persistence'
import { escapeRegExp, rest } from 'lodash'
import { z } from 'zod'


describe('PersistenceManager',()=>{

    const storageKey = 'testKey'

    const TestSchema = z.object({
      string: z.string(),
      number: z.number(),
      boolean: z.boolean()
  }).strict()

    type TestType = z.infer<typeof TestSchema>


    const storageValue : TestType = {
      string: 'string',
      number: 0,
      boolean: true,
    };


    const testPM = new PersistenceManager(storageValue, storageKey);
    const testPMWithZod = new PersistenceManager(storageValue,storageKey,TestSchema)

    afterEach(()=>localStorage.clear())

    it('should return a correct instance', () => {
      expect(testPM instanceof PersistenceManager).toBe(true);
      expect('get' in testPM).toBe(true);
      expect('save' in testPM).toBe(true);
    });

    it('should save value to localStorage', ()=>{
      expect(localStorage.getItem(storageKey)).toBe(null)

      testPM.save()

      const result = localStorage.getItem(storageKey)
      expect(result).not.toBe(null)
      const parsedResult = JSON.parse(result)
      expect('items' in parsedResult).toBe(true)
      expect('timestamp' in parsedResult).toBe(true)
      expect(parsedResult.items).toStrictEqual(storageValue)
  })

  it('should be able to return value from localStorage', ()=>{
    localStorage.setItem(storageKey,JSON.stringify({items:storageValue,timestamp:Date.now()}))
    const result =  testPM.get()
    expect(typeof result?.items).toBe(typeof storageValue)
    expect(result?.items).toStrictEqual(storageValue)
  })

  it('should handle edge cases with no/corrupted localStorage',()=>{

    const warnMock = vi.spyOn(console,'warn')
    const nullResult = testPM.get()
    expect(nullResult).toBe(null)

    localStorage.setItem(storageKey,'wrong data')
    const unparsableResult = testPM.get()
    expect(warnMock).toHaveBeenCalledWith('The data retrieved from localStorage could not be parsed', expect.anything())
    expect(unparsableResult).toBe(null)

    localStorage.clear()
    localStorage.setItem(storageKey,'{"items": "test" }')
    const wrongFormatResult = testPM.get()
    expect(warnMock).toHaveBeenCalledWith('The data retrieved from localStorage were not in the expected format')
    expect(wrongFormatResult).toBe(null)


  })

   it('should work with Zod Schema in parameters',()=>{

    const warnMock = vi.spyOn(console,'warn')
    localStorage.setItem(storageKey,JSON.stringify({items:{...storageValue},timestamp:Date.now()}))

    const result =  testPMWithZod.get()
    expect(warnMock).not.toHaveBeenCalled()
    expect(result?.items).toStrictEqual(storageValue)

  })

  it('should not validate a wrongly type object with Zod Schema',()=>{
    const warnMock = vi.spyOn(console,'warn')
    localStorage.setItem(storageKey,JSON.stringify({items:{...storageValue,should: "fail"},timestamp:Date.now()}))

    const result =  testPMWithZod.get()
    expect(warnMock).toHaveBeenCalledWith('Validation Error : ',expect.anything())
    expect(result).toBe(null)
  })

})
