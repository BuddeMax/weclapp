import { shallowMount } from '@vue/test-utils';
import PatientDetails from '@/views/PatientDetails.vue';


describe('PatientDetails.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PatientDetails, {
      // Mocken von Routen-Parametern oder anderen Abhängigkeiten hier, falls erforderlich
    });
  });

  it('renders and initializes correctly', () => {
    expect(wrapper.exists()).toBeTruthy();
    // Weitere Überprüfungen des Anfangszustands
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




