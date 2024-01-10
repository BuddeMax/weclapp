<template>
  <form @submit.prevent="createPatient" class="p-3">
    
    <!-- Oberer Container für Name und Vorname -->
    <div class="form-row">
      <label for="firstname">Firstname:</label>
      <input :class="{'is-valid': newPatient.firstname, 'is-invalid': !newPatient.firstname && submitted}" id="firstname" v-model="newPatient.firstname" type="text" class="form-control" required>
    </div>

    <div class="form-row">
      <label for="name">Surname:</label>
      <input :class="{'is-valid': newPatient.name, 'is-invalid': !newPatient.name && submitted}" id="name" v-model="newPatient.name" type="text" class="form-control" required>
    </div>

    <div class="form-row">
      <label for="gender">Gender:</label>
      <select :class="{'is-valid': newPatient.gender, 'is-invalid': !newPatient.gender && submitted}" id="gender" v-model="newPatient.gender" class="form-control" required>
        <option value="">Choose one</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-row">
      <label for="birthDate">Birthdate:</label>
      <input :class="{'is-valid': newPatient.birthDate, 'is-invalid': !newPatient.birthDate && submitted}" id="birthDate" v-model="newPatient.birthDate" type="date" class="form-control" required>
    </div>

    <div class="form-row">
      <label for="note">Note:</label>
      <textarea :class="{'is-valid': newPatient.note, 'is-invalid': !newPatient.note && submitted}" id="note" v-model="newPatient.note" class="form-control" required rows="4"></textarea>
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
          gender: '',
          birthDate: '',
          firstname: '',
          note:''
        },
        submitted: false
      };
    },
    methods: {
      createPatient() {
        this.submitted = true;
        if(this.isValidForm()) {
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

        fetch("https://webtechprojekt.onrender.com/patient", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        }
        
      },
      getPatients() {
      fetch("https://webtechprojekt.onrender.com/patients")
        .then(response => response.json())
        .then(patientsData => {
          console.log("Aktualisierte Patientenliste:", patientsData);

        })
        .catch(error => {
          console.error('Fehler beim Abrufen der Patientenliste:', error);
        });
    },
      isValidForm() {
      return this.newPatient.name && this.newPatient.gender && this.newPatient.birthDate && this.newPatient.firstname && this.newPatient.note;
    }
    },
  }
  </script>
  
  <style scoped>
  .form-container {
    /* Standard-Stile für das Formular */
    width: 100%;
    padding: 20px;
  }
  
  .is-valid {
    border-color: green;
  }

  .is-invalid {
    border-color: red;
  }

  textarea{

  }
  </style>
  