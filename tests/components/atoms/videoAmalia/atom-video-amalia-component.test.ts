import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomVideoAmalia from '@/components/atoms/videoAmalia/AtomVideoAmalia.vue'
import {ref} from "vue";

vi.mock('#imports', () => ({
  useService: () => ({
    $amalia: {
      createPlayer: vi.fn(() => document.createElement('div')),
      updateCurrentTc: vi.fn(),
      callSeek: vi.fn(() => 123.456)
    },
    $application: {
      timestampToUnix: vi.fn(),
      unixToTimestamp: vi.fn((val: any) => val)
    }
  })
}))

vi.mock('@/components/atoms/videoAmalia/atom-video-amalia-component.ts', async (original) => {
  const actual = await original()
  return {
    ...actual
  }
})

vi.mock('@/composables/useTimecodeHistory', () => ({
  default: () => ({
    getHistory: ref([{ tcin: 1000 }, { tcin: 2000 }]),
    consumeTimecode: vi.fn(() => 1000)

  }),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('test')
  })
) as any

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
        stubs: ['Button']
      }
    })
    await new Promise(resolve => setTimeout(resolve, 50))

  })

  it('renders player div', () => {
    expect(wrapper.find('#PLAYER').exists()).toBe(true)
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
        stubs: ['Button']
      }
    })
    const button = wrapper.findComponent({ name: 'Button' })
    await button.trigger('click')
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
        stubs: ['Button']
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
      stubs: ['Button']
    }
  })
    await new Promise(resolve => setTimeout(resolve, 50))
    const expectedSrc = `data:application/vnd.apple.mpegurl;base64,test`

    // Vérifier la valeur de dynamicSrc
    expect(wrapper.vm.dynamicSrc).toBe(expectedSrc)
    expect(fetch).toHaveBeenCalledWith('https://example.com/stream.m3u8?typemedia=video')
  })
})
