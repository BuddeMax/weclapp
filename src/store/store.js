import { createStore } from 'vuex';

export const store = createStore({
    state: {
        errors: [],
    },
    mutations: {
        setError(state, error) {
            state.errors.push(error);
        }
    }
});
