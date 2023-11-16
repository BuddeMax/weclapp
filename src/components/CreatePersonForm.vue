<template>
    <form @submit.prevent="createPatient">
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" v-model="newPatient.name" type="text" class="form-control" required>
      </div>
  
      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" v-model="newPatient.age" type="number" class="form-control" required>
      </div>
  
      <button type="submit" class="btn btn-primary">Add Patient</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newPatient: {
          name: '',
          age: '',
        },
      };
    },
    methods: {
      createPatient() {
        // Hier kannst du die Daten verwenden oder an einen Service senden
        console.log('Neuer Patient:', this.newPatient);
        // Füge hier die Logik hinzu, um den Patienten zu erstellen oder zu speichern
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "name": this.newPatient.name,
        "age": this.newPatient.age
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:8080/patient", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        },
    },
  }
  </script>
  
  <style scoped>
  /* Füge hier bei Bedarf benutzerdefinierte CSS-Stile hinzu */
  </style>
  