import { shallowMount } from '@vue/test-utils'
import AppNavbar from '@/components/AppNavbar.vue'

describe('AppNavbar.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(AppNavbar)
    expect(wrapper.vm).toBeTruthy()
  })
})


