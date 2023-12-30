<template>
  <div class="container" :class="{ 'dark-mode': darkMode }">
    <h1 class="text-center">Patient List</h1>

    <!-- Anzeige des Formulars -->
    <div v-if="showForm" class="form-container">
      <CreatePersonForm @addPerson="addPerson" />
    </div>

    <!-- Button, um das Formular anzuzeigen oder auszublenden -->
    <button @click="toggleForm" class="btn btn-primary" style="position: fixed: ;top : 20px; right: 20px;">
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
            <!-- Hinzugefügtes Löschen-Icon -->
            <button @click="deletePatient(patient.id)" class="btn btn-danger">Delete</button>
            <!-- Hinzugefügter Anzeigen-Button -->
            <!-- In deiner Patient.vue-Komponente oder wo du den Anzeigen-Button hinzugefügt hast -->
            <router-link :to="{ name: 'PatientDetails', params: { id: patient.id } }" class="btn btn-primary">Anzeigen</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Anzeige der ausgewählten Patientendetails -->
    <div v-if="selectedPatient">
      <h2>{{ selectedPatient.name }} Details</h2>
      <p><strong>Age:</strong> {{ selectedPatient.age }}</p>
      <!-- Weitere Eigenschaften hier hinzufügen -->

      <!-- Hinzugefügtes Löschen-Icon -->
      <button @click="deletePatient(selectedPatient.id)" class="btn btn-danger">Delete</button>
    </div>
  </div>
</template>

<script>
import CreatePersonForm from '@/components/CreatePersonForm';
import PatientService from '../store/PatientService';

export default {
  name: 'PatientsService',
  data() {
    return {
      patients: [],
      selectedPatientId: null,
      selectedPatient: null,
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
        //test
        await this.getPatients();
      } catch (error) {
        console.error(`Error deleting patient with ID ${patientId}:`, error);
      }
    },
    async addPerson(person) {
      try {
        // Hier implementiere die Logik zum Hinzufügen eines Patienten
        console.log('Neuer Patient:', person);
        // Füge hier die Logik hinzu, um den Patienten zu erstellen oder zu speichern

        // Nach erfolgreichem Hinzufügen die Patientenliste aktualisieren
        await this.getPatients();
      } catch (error) {
        console.error('Error adding person:', error);
      }
    },
    showPatientDetails(patientId) {
      // Hier kannst du zusätzliche Informationen zum ausgewählten Patienten laden und anzeigen
      console.log('Zeige Patientendetails an:', patientId);
      // Füge hier die Logik hinzu, um weitere Patientendetails zu laden und anzuzeigen
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
.container {
  padding: 20px;
}


.form-container {
  /* Standard-Stile für das Formular */
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa; /* Hintergrundfarbe des Formulars ändern */
}

.card {
  /* Standard-Stile für die Karte */
  width: 100%;
}


button {
  margin: 10px; /* Abstand um die Schaltflächen hinzufügen */
}
</style>



 



