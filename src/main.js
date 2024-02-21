import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store/store'; // Achte darauf, dass der Importpfad korrekt ist
import router from './router';
// In deiner main.js-Datei
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';



const app = createApp(App);
app.use(store); // Hier fügst du den Vuex Store zur App hinzu
app.use(router);
app.mount('#app');

