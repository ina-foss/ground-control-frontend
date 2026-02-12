import {mount} from "@vue/test-utils";
import Id from "../../../app/pages/tasks/[id].vue";
import { it} from "vitest";


describe('[id].vue', () => {
  it('mounts properly ', async () => {
    const wrapper = mount(Id,{})
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ name: 'OrganismAnnotation' }).exists()).toBe(false)

  })
})
