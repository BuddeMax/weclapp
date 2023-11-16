<template>
  <div class="container">
      <h1 class="text-center"> Patient List and Hello World</h1>
      <table class="table table-striped">
          <head>
              <th> Patient Id </th>
              <th> Patient Name </th>
              <th> Patient Age </th>
          </head>
          <body>
              <tr v-for = "patient in patients" v-bind:key = "patient.id">
                  <td>{{patient.id}}</td>
                  <td>{{patient.name}}</td>
                  <td>{{patient.age}}</td>
              </tr>
          </body>
      </table>
  </div>

  
</template>

<script>
import PatientService from '../services/PatientService'

export default {
name: 'PatientsService',
data() {
  return {
    patients: []
  }
},
methods: {
  async getPatients() {
    try {
      const response = await PatientService.getPatients();
      this.patients = response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }
},
created() {
  this.getPatients();
}
}
</script>


