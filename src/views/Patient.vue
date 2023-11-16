<template>
  <div class="container">
    <h1 class="text-center">Patient List and Hello World</h1>

    <!-- Anzeige des Formulars -->
    <div class="form-container">
      <CreatePersonForm v-if="showForm" @addPerson="addPerson" />
    </div>

    <!-- Button, um das Formular anzuzeigen oder auszublenden -->
    <button @click="toggleForm" class="btn btn-primary" style="position: fixed; bottom: 20px; right: 20px;">
      {{ showForm ? 'Hide Form' : 'Add Patient' }}
    </button>

    <!-- Patientenliste -->
    <div class="row">
      <div v-for="patient in patients" :key="patient.id" class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Patient ID: {{ patient.id }}</h5>
            <p class="card-text">
              <strong>Name:</strong> {{ patient.name }}<br>
              <strong>Age:</strong> {{ patient.age }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreatePersonForm from '@/components/CreatePersonForm';
import PatientService from '../services/PatientService';

export default {
  name: 'PatientsService',
  data() {
    return {
      patients: [],
      showForm: true, // Ändere auf true, um das Formular standardmäßig anzuzeigen
    };
  },
  methods: {
    async getPatients() {
      try {
        const response = await PatientService.getPatients();
        this.patients = response.data;
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    addPerson(person) {
      // Hier implementiere die Logik zum Hinzufügen eines Patienten
      console.log('Neuer Patient:', person);
      // Füge hier die Logik hinzu, um den Patienten zu erstellen oder zu speichern
    },
  },
  created() {
    this.getPatients();
  },
  components: {
    CreatePersonForm,
  },
};
</script>

<style scoped>
/* Füge hier bei Bedarf benutzerdefinierte CSS-Stile hinzu */

/* Stile für das Formular-Container */
.form-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 999; /* Damit es über anderen Inhalten liegt */
}
</style>
