import {expect, describe, it, vi }  from 'vitest'
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AtomSpanDetail from '~/components/atoms/AtomSpanDetail.vue';
import type { VueWrapper } from '@vue/test-utils';

vi.mock('~/utils/colors',()=>({
  textColorPicker: vi.fn()
}))

const mockedLabelsArray = [
  'label1',
  'label2',
  'label3'
]

const mockedSpanArray = [
  {
    addLeft: vi.fn(),
    addRight: vi.fn(),
    focus: false,
    id: 0,
    labels: [],
    label: ['Label1'],
    tcin: "54.450",
    tcout: "1:05.200",
    text: "Text inside the span"
  },
  {
    addLeft: vi.fn(),
    addRight: vi.fn(),
    focus: true,
    id: 1,
    labels:[],
    label: ['Label2'],
    tcin: "23.450",
    tcout: "35.600",
    text: "Other text inside the span"
  }
]

const mockedRelationArray = [
  {
    from: 0,
    to: 1
  }
]

describe('AtomSpanDetail should',()=>{

  let wrapper: VueWrapper


  beforeEach(async()=>{
    wrapper = await mountSuspended(AtomSpanDetail,{
      props: {
        spanRefArray: mockedSpanArray,
        labels: mockedLabelsArray
      }
    })
  })

  it('be mounted ',()=>{
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text().includes('Aucune sélection')).toBe(true)
  })

  it('show all the span created',async()=>{
    expect(wrapper.text().includes('Annotations (2)')).toBe(true)
  })


  it('show the current selected span',async()=>{
    await wrapper.setProps({focusSpan: 1})
    expect(wrapper.text().includes('Nothing selected')).toBe(false)
    expect(wrapper.text().split('Other text inside the span').length).toBe(3) // The string is present 2 times in the wrapper text
  })

  it('show the relations',async()=>{
    await wrapper.setProps({relationArray: mockedRelationArray})
    expect(wrapper.text().includes('No Regions Created yet')).toBe(false)
    expect(wrapper.text().includes('12')).toBe(true)
    expect(wrapper.findAll('b')[2].wrapperElement.innerText).toBe('Relations (1)')

  })

})
