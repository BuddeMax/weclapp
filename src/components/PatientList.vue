<template>
    <div>
      <h2 class="text-center">Patient List</h2>
      <ul class="list-group">
        <li v-for="patient in patients" :key="patient.id" class="list-group-item patient-item">
          <router-link :to="{ name: 'PatientDetails', params: { id: patient.id } }">
            <strong>Patient ID:</strong> {{ patient.id }}<br>
            <strong>Name:</strong> {{ patient.name }}<br>
            <strong>Age:</strong> {{ patient.age }}
          </router-link>
          <button @click="deletePatient(patient.id)" class="btn btn-danger">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import PatientService from '@/services/PatientService';
  
  export default {
    name: 'PatientList',
    props: {
      patients: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      async deletePatient(patientId) {
        try {
          await PatientService.deletePatient(patientId);
          this.$emit('patientDeleted', patientId); // Emit an event to notify the parent component
        } catch (error) {
          console.error(`Error deleting patient with ID ${patientId}:`, error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Stile für die Patientenliste */
  .patient-item {
    margin-bottom: 20px;
  }
  </style>
  