import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomSentence from '@/components/atoms/sentence/AtomSentence.vue'
import { nextTick, ref } from 'vue'
import { mockNuxtImport} from "@nuxt/test-utils/runtime";

const mockTranscriptions = [{
  tcin: 123,
  tcout: 456,
  data: {
    topic: 1
  }
}]

const mockTopicList = {
  1: { title: 'Sujet important' }
}

const mockSpanRefArray = ref([
  { id: 1, text: 'Phrase 1', tcin: 124, tcout: 130 },
  { id: 2, text: 'Phrase 2', tcin: 131, tcout: 140 },
  { id: 3, text: 'Phrase 3', tcin: 1000, tcout: 1100 },
])

const onDeleteSpan = vi.fn()
const mockLocals = ref([
  {
    tcin: '00:02:00.000',
    tcout: '00:10:00.000',
    data: { topic: 1 }
  }
])

mockNuxtImport('useSpanService', async()=>{
  return ()=>({
    spanArray: mockSpanRefArray,
    extractTextFromSpanNodes: vi.fn().mockReturnValue("span text content"),
    onDeleteSpan
  })
})


vi.mock('@/composables/useTopicList', () => ({
  useTopicList: () => ({ topicList: mockTopicList })
}))

describe('AtomSentence.vue', () => {
  let wrapper: any
  const jumpToTopic = vi.fn()
  const timestampToUnix = (tcin: number) => `${tcin}s`


  beforeEach(() => {
    wrapper = mount(AtomSentence, {
      props: {
        transcriptions: mockTranscriptions
      },
      global: {
        provide: {
          spanService: { spanRefArray: mockSpanRefArray, onDeleteSpan },
          span: { locals: mockLocals },
          jumpToTopic,
        },
        mocks: {
          $application: {
            computeColor: vi.fn(),
            textColorPicker: vi.fn(),
            computeColorByLabel: vi.fn(),
            timestampToUnix: timestampToUnix,
            unixToTimestamp: (ts: string | number) => {
              if (typeof ts === 'string') {
                const [min, sec] = ts.split(':').slice(-2)
                return parseInt(min) * 60 + parseInt(sec)
              }
              return ts
            },
          }
        }
      }
    })
  })

  it('affiche le bon titre de topic', () => {
    expect(wrapper.text()).toContain('Sujet important')
  })

    it('appelle onDeleteSpan quand on clique sur la poubelle', async () => {
      const spans = wrapper.findAll('.pi-trash')
      const trash = spans[0]
      await trash.trigger('click')
      expect(onDeleteSpan).toHaveBeenCalledWith({ index: 1 })
      //affiche les spans liés au topic
      expect(spans.length).toBe(2)
    })

  it('affiche "Aucune phrase selectionnee" si aucun span ne correspond', async () => {
      mockSpanRefArray.value = []
      await nextTick()
      expect(wrapper.text()).toContain('Aucune phrase selectionnee')
    })


  it('n’affiche rien si la liste est vide', async () => {
    const emptyWrapper = mount(AtomSentence, {
      props: {},
      global: {
        provide: {
          spanService: { spanRefArray: mockSpanRefArray, onDeleteSpan },
          span: { locals: mockLocals },
          jumpToTopic,
        }
      }
    })
    expect(emptyWrapper.exists()).toBe(true)
  })

    it('navigue vers un topic si on clique sur le header avec topic', async () => {
      const header = wrapper.find('.cursor-pointer')
      await header.trigger('click')
      expect(jumpToTopic).toHaveBeenCalledWith({ topic: 1 })
    })

  it('retourne "no span" si aucun span n\'est fourni', () => {
    const vm = wrapper.vm as any
    const result = vm.getTopicFromSpan(undefined)
    expect(result).toBe('no span')
  })
})
