// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Patient from '../views/Patient.vue';
import PatientDetails from '../views/PatientDetails.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/patient',
    name: 'Patient',
    component: Patient,
  },
  {
    path: '/patient/:id',
    name: 'PatientDetails',
    component: PatientDetails,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
});

export default router;
