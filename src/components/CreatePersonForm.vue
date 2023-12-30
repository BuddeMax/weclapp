<template>
  <form @submit.prevent="createPatient" class="p-3">
    
    <!-- Oberer Container für Name und Vorname -->

    
      <div class="form-row">
        <label for="firstname">Vorname:</label>
        <input id="firstname" v-model="newPatient.firstname" type="text" class="form-control" required>
      </div>

      <div class="form-row">
        <label for="name">Name:</label>
        <input id="name" v-model="newPatient.name" type="text" class="form-control" required>
      </div>

  

      <div class="form-row">
        <label for="gender">Geschlecht:</label>
        <select id="gender" v-model="newPatient.gender" class="form-control" required>
          <option value="">Bitte auswählen</option>
          <option value="male">Männlich</option>
          <option value="female">Weiblich</option>
          <option value="other">Andere</option>
        </select>
      </div>

      <div class="form-row">
        <label for="birthDate">Geburtsdatum:</label>
        <input id="birthDate" v-model="newPatient.birthDate" type="date" class="form-control" required>
      </div>


    <!-- Unterer Container für Notizen -->
    <div class="form-row">
      <label for="note">Notiz:</label>
      <textarea id="note" v-model="newPatient.note" class="form-control" required rows="4"></textarea>
    </div>

    <button type="submit" class="btn btn-primary">Patient hinzufügen</button>
  </form>
</template>
  
  <script>
  export default {
    data() {
      return {
        newPatient: {
          name: '',
          gender: '',
          birthDate: '',
          firstname: '',
          note:''
        },
      };
    },
    methods: {
      createPatient() {
        //test
        // Hier kannst du die Daten verwenden oder an einen Service senden
        console.log('Neuer Patient:', this.newPatient);
        // Füge hier die Logik hinzu, um den Patienten zu erstellen oder zu speichern
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "name": this.newPatient.name,
        "age": this.newPatient.age,
        "gender": this.newPatient.gender,
        "birthDate": this.newPatient.birthDate,
        "firstname": this.newPatient.firstname,
        "note": this.newPatient.note
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
  .form-container {
    /* Standard-Stile für das Formular */
    width: 100%;
    padding: 20px;
  }
  
  /* Stile für Bildschirme mit einer Breite von 1024px oder mehr (typischer Laptop) */
  @media screen and (min-width: 1024px) {
    .form-container {
      width: 50%; /* Formularbreite auf 50% setzen */
      margin: 0 auto; /* Zentrieren des Formulars */
    }
  }
  </style>
  