<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1 class="text-center">Patient List and Hello World</h1>

    <!-- Anzeige des Formulars -->
    <div v-if="showForm" class="form-container">
      <CreatePersonForm @addPerson="addPerson" />
    </div>

    <!-- Button, um das Formular anzuzeigen oder auszublenden -->
    <button @click="toggleForm" class="btn btn-primary" style="position: fixed; bottom: 20px; right: 20px;">
      {{ showForm ? 'Hide Form' : 'Add Patient' }}
    </button>

    <!-- Button für Dark Mode Toggle -->
    <button @click="toggleDarkMode" class="btn btn-secondary" style="position: fixed; bottom: 20px; left: 20px;">
      {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
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
            <!-- Hinzugefügtes Löschen-Icon -->
            <button @click="deletePatient(patient.id)" class="btn btn-danger">Delete</button>
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
      showForm: true,
      darkMode: false,
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
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    async deletePatient(patientId) {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow',
        };

        await fetch(`http://localhost:8080/patient/${patientId}`, requestOptions);
        
        // Nach erfolgreichem Löschen die Patientenliste aktualisieren
        this.getPatients();
      } catch (error) {
        console.error(`Error deleting patient with ID ${patientId}:`, error);
      }
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

/* Stile für Dark Mode */
.dark-mode {
  background-color: #333; /* Hintergrundfarbe für Dark Mode */
  color: white; /* Textfarbe für Dark Mode */
}

.dark-mode .form-container {
  background-color: #555; /* Hintergrundfarbe für Formular-Container im Dark Mode */
  color: white; /* Textfarbe für Formular-Container im Dark Mode */
}
</style>


 



