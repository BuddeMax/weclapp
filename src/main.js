import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker'
import { store } from './store/store'; // Achte darauf, dass der Importpfad korrekt ist

const app = createApp(App);
app.use(store); // Hier fügst du den Vuex Store zur App hinzu
app.mount('#app');



