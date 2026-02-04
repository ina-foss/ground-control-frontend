import MoleculeDialogConfirm from '../../../components/molecules/moleculeDialogConfirm/MoleculeDialogConfirm.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'

describe('MoleculeDialogConfirm', () => {
  let wrapper: VueWrapper

  const defaultProps = {
    visible: true,
    title: 'Confirm action',
    message: 'Are you sure?',
    description: 'This action cannot be undone',
    withExclamation: true,
    cancelButton: { label: 'Cancel' },
    confirmButton: { label: 'Confirm' }
  }

  beforeEach(async () => {
    wrapper = await mountSuspended(MoleculeDialogConfirm, {
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
          Button: {
            name: 'Button',
            template: `<button @click="$emit('click')"></button>`
          }
        }
      }
    })
  })

  it('should render title and texts', () => {
    expect(wrapper.text()).toContain('Confirm action')
    expect(wrapper.text()).toContain('Are you sure?')
    expect(wrapper.text()).toContain('This action cannot be undone')
  })

  it('should render exclamation icon', () => {
    expect(wrapper.find('.pi-exclamation-triangle').exists()).toBe(true)
  })

  it('should emit cancel and close dialog', async () => {
    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
  })

  it('should emit confirm event', async () => {
    const buttons = wrapper.findAll('button')

    await buttons[1].trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
  })
})
