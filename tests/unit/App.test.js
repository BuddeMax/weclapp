import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import {nextTick} from "vue";
import { convertExcelToJSDate } from '@/components/Dashboard.vue';

describe('App.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(App, {
            data() {
                return {
                    customers: [],
                    salesOrders: [],
                    orderItems: [],
                    tasks: [],
                    users: [],
                    issues: [],
                    postConfirmed: false,
                    dataRead: false,
                    dataLoaded: false,
                    apiKeyConfirmed: false,
                    domainConfirmed: false,
                    apiKeyVisible: false,
                    domainVisible: false,
                    fileUploaded: false
                };
            }
        });
    });

    test('renders a title', () => {
        const title = wrapper.find('h1');
        expect(title.text()).toBe('Weclapp Time Track');
    });

    test('contains a file input', () => {
        const fileInput = wrapper.find('input[type="file"]');
        expect(fileInput.exists()).toBe(true);
    });

    test('initial button text is "Daten laden"', () => {
        const button = wrapper.find('button');
        expect(button.text()).toContain('Daten laden');
    });




});


describe('convertExcelToJSDate', () => {
    test('converts Excel date to JS date correctly', () => {
        const excelDate = 44282; // Beispiel Excel Datum
        const jsDate = convertExcelToJSDate(excelDate);

        // Erwartetes JS Datum erstellen
        const expectedJsDate = new Date(2021, 0, 1); // Ersetzen Sie dies durch das erwartete JS Datum

        expect(jsDate).toEqual(expectedJsDate);
    });

});