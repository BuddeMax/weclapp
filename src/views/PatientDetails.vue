<!-- components/PatientDetails.vue -->
<template>
    <div>
      <h2>{{ patient.name }} Details</h2>
      <p><strong>ID:</strong> {{ patient.id }}</p>
      <p><strong>Name:</strong> {{ patient.name }}</p>
      <p><strong>Age:</strong> {{ patient.age }}</p>
      <!-- Füge hier weitere Details hinzu -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      patient: Object, // Erwarte ein Patientenobjekt als Prop
    },
  };
  </script>
  