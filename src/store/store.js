import { createStore } from 'vuex';

export const store = createStore({
    state: {
        domain: '', // Zustandsvariable für die Domain
        apiKey: '', // Zustandsvariable für den API-Schlüssel
    },
    mutations: {
        setDomain(state, domain) { // Mutation zum Setzen der Domain
            state.domain = domain;
        },
        setApiKey(state, apiKey) { // Mutation zum Setzen des API-Schlüssels
            state.apiKey = apiKey;
        }
    }
});
