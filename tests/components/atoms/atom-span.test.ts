import {expect, describe, it }  from 'vitest'
import { mockNuxtImport,mountSuspended } from "@nuxt/test-utils/runtime";
import AtomSpan from '~/components/atoms/AtomSpan.vue';
import type { VueWrapper } from '@vue/test-utils';


describe('AtomSpan should',()=>{

  let wrapper: VueWrapper

  beforeEach(async()=>{
    wrapper = await mountSuspended(AtomSpan,{
      props:{
        labels:ref(['label test, label2']),
        label: ['label test'],
        tcIn: '00:00:10.0000',
        tcOut: '00:00:15.0000',
        options: ref({span: true})
      }
    })
  })

  it('mount',async () =>{
    expect(wrapper.exists()).toBe(true)
  })

  it('display labels passed in props',async()=>{
    expect(wrapper.text()).toContain('label test')
  })

  it('contains tcIn and tcOut',async ()=>{
    expect(wrapper.attributes().tcin).toContain('00:00:10.0000')
    expect(wrapper.attributes().tcout).toContain('00:00:15.0000')
  })


})
