<template>
  <div class="container">
    <h1 class="text-center">Patient Details</h1>

    <div v-if="patient">
      <div class="patient-info">
        <h2>{{ patient.name }} {{ patient.firstname }} Details</h2>
        
        <div class="row">
          <div class="col-md-4">
            <div class="info-box">
              <strong>Age:</strong>
              <p>{{ patient.age }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="info-box">
              <strong>Birth Date:</strong>
              <p>{{ patient.birthDate }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="info-box">
              <strong>Gender:</strong>
              <p>{{ patient.gender }}</p>
            </div>
          </div>
        </div>

        <!-- Weitere Information-Boxen hier hinzufügen -->

        <div class="info-box">
          <strong>Bed:</strong>
          <p>{{ patient.bed ? patient.bed.id : 'N/A' }}</p>
        </div>

        <div class="info-box">
          <strong>Area:</strong>
          <p>{{ patient.area ? patient.area.areaId : 'N/A' }}</p>
        </div>

        <div class="info-box">
          <strong>Responsible Physician:</strong>
          <p>{{ patient.responsiblePhysician ? patient.responsiblePhysician.id : 'N/A' }}</p>
        </div>

        <div class="info-box">
          <strong>Responsible Nurse:</strong>
          <p>{{ patient.responsibleNurse ? patient.responsibleNurse.id : 'N/A' }}</p>
        </div>

        <div class="info-box">
          <strong>Vital Signs:</strong>
          <ul v-if="patient.vitalSigns && patient.vitalSigns.length">
            <li v-for="vitalSign in patient.vitalSigns" :key="vitalSign.id">{{ vitalSign.name }}: {{ vitalSign.value }}</li>
          </ul>
          <p v-else>No vital signs available</p>
        </div>

        <div class="info-box">
          <strong>Note:</strong>
          <p>{{ patient.note || 'N/A' }}</p>
        </div>
      </div>

      <button @click="deletePatient(patient.id)" class="btn btn-danger mt-3">Delete</button>
    </div>
  </div>
</template>

<script>
import PatientService from '../store/PatientService';

export default {
  name: 'PatientDetails',
  data() {
    return {
      patient: null,
    };
  },
  methods: {
    async loadPatientDetails() {
      try {
        const patientId = this.$route.params.id
        const response = await PatientService.getPatient(patientId);
        this.patient = response.data;
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    },
    deletePatient(patientId) {
      // Implementiere die Logik zum Löschen eines Patienten
      console.log(`Deleting patient with ID ${patientId}`);
    },
  },
  created() {
    this.loadPatientDetails();
  },
};
</script>

<style scoped>
.patient-info {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.info-box {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
}

/* Stildefinitionen, falls erforderlich */
</style>



