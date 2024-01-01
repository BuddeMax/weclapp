import { shallowMount } from '@vue/test-utils';
import PatientDetails from '@/views/PatientDetails.vue';

describe('PatientDetails.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Mocken von Routen-Parametern
    const $route = {
      params: { id: '123' }
    };

    wrapper = shallowMount(PatientDetails, {
      mocks: {
        $route
      }
    });
  });

  it('renders and initializes correctly', () => {
    expect(wrapper.exists()).toBeTruthy();
    // Überprüfen des initialen Zustands
  });

  it('toggles the file form', async () => {
    expect(wrapper.vm.showForm).toBe(false);
    await wrapper.vm.toggleFileForm();
    expect(wrapper.vm.showForm).toBe(true);
  });

  it('toggles todo form visibility', async () => {
    expect(wrapper.vm.showTodoForm).toBe(false);
    await wrapper.vm.toggleTodoForm();
    expect(wrapper.vm.showTodoForm).toBe(true);
  });
  


});




