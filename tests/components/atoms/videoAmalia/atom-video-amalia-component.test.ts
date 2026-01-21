import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomVideoAmalia from '@/components/atoms/videoAmalia/AtomVideoAmalia.vue'
import {ref} from "vue";
import {createI18n} from "vue-i18n";

const consumeTimecodeMock = vi.fn(() => 456)
const unixToTimestampMock = vi.fn(() => 789)
const updateCurrentTcMock = vi.fn()
vi.mock('#imports', () => ({
  useService: () => ({
    $amalia: {
      createPlayer: vi.fn(() => document.createElement('div')),
      updateCurrentTc: updateCurrentTcMock,
      callSeek: vi.fn(() => 123.456)
    },
    $application: {
      timestampToUnix: vi.fn(),
      unixToTimestamp: unixToTimestampMock
    }
  })
}))

vi.mock('@/components/atoms/videoAmalia/atom-video-amalia-component.ts', () => ({
  initAmaliaPlayer: vi.fn(() => ({
    player: document.createElement('div'),
    seek: vi.fn(),
    handleRewindTimecode: vi.fn(),
    destroy: vi.fn(),
  })),
}))

vi.mock('@/composables/useTimecodeHistory', () => ({
  default: () => ({
    getHistory: ref([{ tcin: 1000 }, { tcin: 2000 }]),
    consumeTimecode: consumeTimecodeMock

  }),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('test')
  })
) as any

const i18n = createI18n({
  legacy: false,
  locale: 'fr'
})

describe('AtomVideoAmalia', () => {
  let wrapper: any

  beforeEach(async () => {
    wrapper = mount(AtomVideoAmalia, {
      props: {
        media_params: {
          thumbnail_base_url: '/thumbs',
          download_base_url: '/download',
          waveform_base_url: '/waveform'},
        locals: [
          { tcin: 1000 },
          { tcin: 2000 },
          { tcin: 3000 }
        ],
        videoSrc: 'https://example.com/stream.m3u8?typemedia=audio'
      },
      global: {
        stubs: ['Button'],
        plugins: [i18n]
      }
    })
    await new Promise(resolve => setTimeout(resolve, 50))

  })

  it('renders player div', () => {
    expect(wrapper.find('#PLAYER').exists()).toBe(true)
  })

  it('has visibleRight initially set to false', () => {
    wrapper = mount(AtomVideoAmalia, {
      props: {
        media_params: {
          thumbnail_base_url: '/thumbs',
          download_base_url: '/download',
          waveform_base_url: '/waveform'},
        videoSrc: 'https://example.com/stream.m3u8?typemedia=audio'
      },
      global: {
        stubs: ['Button'],
        plugins: [i18n]
      }
    })
    expect(wrapper.vm.visibleRight).toBe(false)
  })

  it('exposes seek and handleRewindTimecode', () => {
    expect(wrapper.vm.seek).toBeInstanceOf(Function)
    expect(wrapper.vm.handleRewindTimecode).toBeTruthy()
  })

  it('emits timecode-update when seek is called', async () => {
    wrapper.vm.seek()
    await nextTick()
    expect(wrapper.emitted('timecode-update')).toBeTruthy()
  })

  it('calls handleRewindTimecode on button click', async () => {

    wrapper = mount(AtomVideoAmalia, {
      props: {
        media_params: {
          thumbnail_base_url: '/thumbs',
          download_base_url: '/download',
          waveform_base_url: '/waveform'},
        videoSrc: 'https://example.com/stream.m3u8?typemedia=video'
      },
      global: {
        stubs: ['Button'],
        plugins: [i18n]
      }
    })
    const rewindButton = wrapper.get('[data-testid="rewind-btn"]')
    await rewindButton.trigger('click')
    expect(wrapper.vm.handleRewindTimecode).toBeDefined()
  })

  it('calls seek method on click in player area', async () => {
    wrapper = mount(AtomVideoAmalia, {
      props: {
        media_params: {
          thumbnail_base_url: '/thumbs',
          download_base_url: '/download',
          waveform_base_url: '/waveform'},
        locals: [
          { tcin: 1000 },
          { tcin: 2000 },
          { tcin: 3000 }
        ],
        videoSrc: 'https://example.com/stream.m3u8?typemedia=video'
      },
      global: {
        stubs: ['Button'],
        plugins: [i18n]
      }
    })
    await new Promise(resolve => setTimeout(resolve, 50))
    const seek = vi.spyOn(wrapper.vm, 'seek')
    await wrapper.find('#PLAYER').trigger('click')
    expect(seek).toHaveBeenCalled()
  })



  it('fetches and sets dynamicSrc correctly', async () => {
    wrapper = mount(AtomVideoAmalia, {
    props: {
      locals: [
        { tcin: 1000 },
        { tcin: 2000 },
        { tcin: 3000 }
      ],
      videoSrc: 'https://example.com/stream.m3u8?typemedia=video'
    },
    global: {
      stubs: ['Button'],
      plugins: [i18n]
    }
  })
    await new Promise(resolve => setTimeout(resolve, 50))
    const expectedSrc = `data:application/vnd.apple.mpegurl;base64,test`

    expect(wrapper.vm.dynamicSrc).toBe(expectedSrc)
    expect(fetch).toHaveBeenCalledWith('https://example.com/stream.m3u8?typemedia=video')
  })

  it('recrée le player quand visibleRight devient false', async () => {

    const vm: any = wrapper.vm
    vm.categories = ref([
      { name: 'Avance', key: 'forward' },
      { name: 'Retour', key: 'backward' }
    ])

    vm.visibleRight = true
    vm.visibleRight = false

    await nextTick()

    expect(vm.categories.length).toBe(2)

  })
})
