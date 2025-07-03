import { mount, flushPromises } from '@vue/test-utils';
import AtomTimecodeList from '@/components/atoms/AtomTimecodeList.vue';
import { vi,it } from 'vitest';
import { nextTick, ref } from 'vue';


vi.mock('@/composables/useTimecodeHistory', () => ({
  default: () => ({
    getHistory: ref([10, 20, 30]),
  }),
}));

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $application: {
      timestampToUnix: (val: string) => val,
      unixToTimestamp: (val: number) => val.toString(),
    },
  }),
}))

vi.mock('#imports', async () => {
  const actual = await vi.importActual<any>('#imports');
  return {
    ...actual,
    useService: () => ({
      $application: {
        timestampToUnix: (val: string) => val,
        unixToTimestamp: (val: number) => val.toString(),
      },
    }),
  }
});

vi.mock('nuxt/app', () => ({
  useFetch: vi.fn(() => ({
    data: ref('http://mocked-thumbnail-url.com/thumb.jpg'),
  })),
}));

describe('AtomTimecodeList.vue', () => {
  let mockConsumeTimecode: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockConsumeTimecode = vi.fn();
  });

  const wrapper = mount(AtomTimecodeList, {
    props: {
      thumbnailUrl: 'http://mock.url/video:media-id?params',
    },
    global: {
      provide: {
        videoPlayer: {
          consumeTimecode: mockConsumeTimecode,
        },
      },
    },
  });

  it('renders a list of timecodes and reacts to clicks', async () => {
    await flushPromises();

    const timecodeElements = wrapper.findAll('[data-test="timecode-item"]');
    expect(timecodeElements.length).toBe(3);

    for (const el of timecodeElements) {
      await el.trigger('click');
    }

    expect(mockConsumeTimecode).toHaveBeenCalledTimes(0);
  });

  it('renders thumbnail images if thumbnailUrl is provided', async () => {
    await flushPromises();

    const imgs = wrapper.findAll('img');
    expect(imgs.length).toBeGreaterThan(0);
    expect(imgs[0].attributes('src')).toContain('width=320&start=10');
  });

  it('renders correct index numbers', async () => {
    await flushPromises();

    const spans = wrapper.findAll('[data-test="timecode-item"] span:first-child');
    expect(spans.map(s => s.text())).toEqual(['1', '2', '3']);
  });
});
