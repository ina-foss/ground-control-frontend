import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import YourComponent from '@/components/atoms/AtomTranscriptionSpan.vue'

let unixToTimestampMock: ReturnType<typeof vi.fn>

const mockApplication = {
  unixToTimestamp: vi.fn((tc: string | number) => {
    if (typeof tc === 'number') return tc
    if (!tc.includes(':')) return parseFloat(tc)
    const millisecond = tc.split('.')[1] || '0'
    const timeArray = tc.split('.')[0].split(':')
    const seconds =
      parseInt(timeArray[0]) * 3600 +
      parseInt(timeArray[1]) * 60 +
      parseInt(timeArray[2]) +
      Math.floor(parseFloat('0.' + millisecond) * 100) / 100
    return seconds
  })
}

vi.mock('#imports', () => ({
  useService: () => ({
    $application: mockApplication
  })
}))

beforeEach(() => {
  mockApplication.unixToTimestamp.mockClear()
  unixToTimestampMock = mockApplication.unixToTimestamp
})

describe('YourComponent.vue', () => {
  it('affiche correctement les mots avec classes et attributs', () => {
    const local = {
      sublocalisations: {
        localisation: [
          { tcin: '01:00:00.000', tcout: '01:00:01.500', data: { text: 'A' } },
          { tcin: '12.5', tcout: '13.5', data: { text: ',' } },
          { tcin: 42, tcout: 43, data: { text: '.' } }
        ]
      }
    }

    const wrapper = mount(YourComponent, {
      props: { local }
    })

    const divs = wrapper.findAll('div[data-tc]')
    expect(divs).toHaveLength(3)

    expect(divs[0].text()).toBe('A')
    expect(divs[1].text()).toBe(',')
    expect(divs[2].text()).toBe('.')

    expect(divs[0].attributes('tcin')).toBe(unixToTimestampMock('01:00:00.000').toString())
    expect(divs[0].attributes('tcout')).toBe(unixToTimestampMock('01:00:01.500').toString())
    expect(divs[1].attributes('tcin')).toBe(unixToTimestampMock('12.5').toString())
    expect(divs[2].attributes('tcin')).toBe(unixToTimestampMock(42).toString())

    expect(divs[0].classes()).toContain('pl-1')
    expect(divs[1].classes()).toContain('pl-0')
    expect(divs[2].classes()).toContain('pl-0')
  })
})
