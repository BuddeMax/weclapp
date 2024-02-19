import { createStore } from 'vuex';
import axios from 'axios';

export const store = createStore({
    state: {
        isAuthenticated: false,
        userEmail: null,
        token: null,
        userId: null,
        startDate: '',
        endDate: '',
        weeklyCheckIn: false,
        checkInInput: false,
        isLoading: false
    },
    mutations: {
        setAuthentication(state, status) {
            state.isAuthenticated = status;
        },
        setEmail(state, email) {
            state.userEmail = email;
        },
        setToken(state, token) {  // Fügen Sie diese Mutation hinzu
            state.token = token;
        },
        setUserId(state, userId) {
            state.userId = userId; // Stelle sicher, dass du auch einen `userId` Zustand definierst
        },
        setStartDate(state, date) {
            state.startDate = date;
        },
        setEndDate(state, date) {
            state.endDate = date;
        },
        setWeeklyCheckIn(state, checkIn) {
            state.weeklyCheckIn = checkIn;
        },
        setCheckInInput(state, input) {
            state.checkInInput = input;
        },
        setLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
    },
    actions: {
        authenticate({ commit }, credentials) {
            return axios.post('/api/authenticate', credentials)
                .then(response => {
                    if (response.status === 200) {
                        commit('setAuthentication', true);
                        commit('setToken', response.data.access_token);
                        commit('setEmail', credentials.email);
                        // Aktualisiere diesen Aufruf, um korrekt auf die Benutzer-ID zuzugreifen
                        commit('setUserId', response.data.user_id); // Angenommen, die Benutzer-ID ist unter `user_id` verfügbar
                        return true;
                    } else {
                        commit('setAuthentication', false);
                        commit('setToken', null);
                        return false;
                    }
                }).catch(() => {
                    commit('setAuthentication', false);
                    commit('setToken', null);
                    return false;
                });
        },
        // Im Vuex Store
        checkDemoController({ commit }) {
            commit('setLoading', true);
            axios.get('https://gainguru.onrender.com/api/v1/demo-controller/public')
                .then(() => {
                    commit('setLoading', false);
                })
                .catch(() => {
                    commit('setLoading', false);
                })

        },


    }
});







