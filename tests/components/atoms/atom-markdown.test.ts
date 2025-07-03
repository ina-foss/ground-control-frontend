import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AtomMarkdown from '~/components/atoms/AtomMarkdown.vue';
// Mock du module markdown
vi.mock('@/utils/markdown', () => ({
  default: {
    render: (content: string) => `<p>${content}</p>`
  }
}))

// Mock de la directive v-safe-html
const safeHtmlDirective = {
  beforeMount(el: HTMLElement, binding: any) {
    el.innerHTML = binding.value
  },
}

describe('AtomMarkdown.vue', () => {
  it('renders parsed markdown as HTML', () => {
    const wrapper = mount(AtomMarkdown, {
      props: {
        content: 'Hello **world**!',
      },
      global: {
        directives: {
          safeHtml: safeHtmlDirective
        }
      }
    })

    // Vérifie que le contenu HTML est rendu correctement
    expect(wrapper.html()).toContain('<p>Hello **world**!</p>')
  })
})
