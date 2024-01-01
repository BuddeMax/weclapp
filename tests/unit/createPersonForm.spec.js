import { shallowMount, flushPromises } from '@vue/test-utils';
import CreatePersonForm from '@/components/CreatePersonForm.vue';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('CreatePersonForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CreatePersonForm);
    fetch.resetMocks();
  });

  // 1. Testen des Renderings der Formularfelder
  it('renders the form fields correctly', () => {
    // Überprüfen, ob jedes Feld im DOM vorhanden ist
    expect(wrapper.find('#name').exists()).toBe(true);
    expect(wrapper.find('#firstname').exists()).toBe(true);
    expect(wrapper.find('#gender').exists()).toBe(true);
    expect(wrapper.find('#birthDate').exists()).toBe(true);
    expect(wrapper.find('#note').exists()).toBe(true);
  });

  // 2. Testen der Validierungslogik für jedes Feld
  describe('field validation', () => {
    it('validates name field', async () => {
      wrapper.setData({ newPatient: { name: '' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#name').classes()).toContain('is-invalid');
    });

    it('validates firstname field', async () => {
      wrapper.setData({ newPatient: { firstname: '' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#firstname').classes()).toContain('is-invalid');
    });

    // Ähnliche Tests für andere Felder...
  });

  // 3. Testen des Absendeverhaltens des Formulars mit ungültigen Daten
  it('does not submit form with invalid data', async () => {
    wrapper.setData({
      newPatient: {
        name: '',
        firstname: '',
        gender: '',
        birthDate: '',
        note: ''
      }
    });

    await wrapper.vm.$nextTick();
    wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(fetch).not.toHaveBeenCalled();
  });

  // 4. Testen des Absendeverhaltens des Formulars mit gültigen Daten
  it('submits form with valid data', async () => {
    fetch.mockResponseOnce(JSON.stringify({ result: 'success' }));
    wrapper.setData({
      newPatient: {
        name: 'Doe',
        firstname: 'John',
        gender: 'male',
        birthDate: '1990-01-01',
        note: 'Test note'
      }
    });

    await wrapper.vm.$nextTick();
    wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(fetch).toHaveBeenCalledTimes(1);
    // Weitere Überprüfungen für den fetch-Aufruf...
  });

  // Weitere Tests können hier hinzugefügt werden...
});


