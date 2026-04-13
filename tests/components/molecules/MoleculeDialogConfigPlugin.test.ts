import MoleculeDialogConfigPlugin from '~/components/molecules/moleculeDialogConfigPlugin/MoleculeDialogConfigPlugin.vue'
import { describe, it, expect, beforeEach, vi,afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises, type VueWrapper } from '@vue/test-utils'

describe('MoleculeDialogConfigPlugin', () => {
  let wrapper: VueWrapper

  const defaultProps = {
    visible: true,
    stepId: 1,
    title: 'Upload config'
  }

  beforeEach(async () => {
    wrapper = await mountSuspended(MoleculeDialogConfigPlugin, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: `
              <div>
                <slot name="header" />
                <slot />
              </div>
            `
          },
          FileUpload: {
            name: 'FileUpload',
            template: `<div @click="$emit('select', { files: mockFiles })"></div>`,
            data() {
              return {
                mockFiles: [new File(['{}'], 'test.json', { type: 'application/json' })]
              }
            }
          },
          Button: {
            name: 'Button',
            template: `<button @click="$emit('click')"></button>`
          }
        },
        mocks: {
          t: (key: string) => key
        }
      }
    })
  })

  afterEach(()=>
    wrapper.unmount()
    )

  it('should render title', () => {
    expect(wrapper.text()).toContain('Upload config')
  })

  it('should emit select event when file is selected', async () => {
    const upload = wrapper.findComponent({ name: 'FileUpload' })

    await upload.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('should disable configure button when no file', () => {
    expect((wrapper.findComponent('button').attributes("data-p-disabled")=="false")).toBeTruthy()
  })

  it('should enable configure button when file is selected', async () => {
    const upload = wrapper.findComponent({ name: 'FileUpload' })

    await upload.trigger('click')
    await flushPromises()

    await wrapper.vm.$nextTick()

    const button = wrapper.find('button')

    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('should emit update:visible when dialog closes', async () => {
    await wrapper.vm.$emit('update:visible', false)

    expect(wrapper.emitted('update:visible')).toBeTruthy()
  })
})
