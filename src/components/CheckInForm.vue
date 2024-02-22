<template>
  <div class="checkIn-form">
    <button class="toggle-form-button" @click="toggleForm">
      <h3>CheckIn hinzufügen</h3>
      <img :src="isFormOpen ? require('@/assets/up-and-down-arrow.png') : require('@/assets/down-and-up-arrow.png')" alt="Toggle Form" class="toggle-form-image">
    </button>
    <form v-if="isFormOpen" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="date">Datum:</label>
        <input type="date" id="date" v-model="formData.date" @change="validateDate">
      </div>
      <div v-if="dateInPast" class="alert alert-warning" role="alert">
        Das eingegebene Datum liegt in der Vergangenheit. Überprüfen Sie, ob das richtige Datum eingegeben wurde.
      </div>
      <div class="form-group">
        <label for="weight">Gewicht (kg):</label>
        <input type="number" id="weight" v-model="formData.weight" step="0.01">
      </div>
      <div class="form-group">
        <label for="sleep">Schlaf (hh:mm):</label>
        <input type="time" id="sleep" v-model="formData.sleep">
      </div>
      <div class="form-group">
        <label for="fatigue">Erschöpfung (1-10):</label>
        <input type="number" id="fatigue" v-model="formData.fatigue" min="1" max="10">
      </div>
      <div class="form-group">
        <label for="mood">Stimmung (1-10):</label>
        <input type="number" id="mood" v-model="formData.mood" min="1" max="10">
      </div>
      <div class="form-group">
        <label for="pain">Schmerz (1-10):</label>
        <input type="number" id="pain" v-model="formData.pain" min="1" max="10">
      </div>
      <div class="form-group">
        <label for="calories">Kalorien:</label>
        <input type="number" id="calories" v-model="formData.calories">
      </div>
      <div class="form-group">
        <label for="protein">Protein (g):</label>
        <input type="number" id="protein" v-model="formData.protein">
      </div>
      <div class="form-group">
        <label for="carb">Kohlenhydrate (g):</label>
        <input type="number" id="carb" v-model="formData.carb">
      </div>
      <div class="form-group">
        <label for="fat">Fett (g):</label>
        <input type="number" id="fat" v-model="formData.fat">
      </div>
      <div class="form-group">
        <label for="water">Wasser (ml):</label>
        <input type="number" id="water" v-model="formData.water">
      </div>
      <div class="form-group">
        <label for="steps">Schritte:</label>
        <input type="number" id="steps" v-model="formData.steps">
      </div>
      <div class="form-group">
        <label for="heartRate">Herzrate:</label>
        <input type="number" id="heartRate" v-model="formData.heartRate">
      </div>
      <div class="form-group">
        <label for="url">URL:</label>
        <input type="url" id="url" v-model="formData.url">
      </div>
      <div v-if="checkInExists" class="alert alert-warning" role="alert">
        Ein CheckIn für den Tag ist bereits vorhanden.
      </div>
      <button type="submit">CheckIn hinzufügen</button>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isFormOpen: false,
      // Initialisiert das Formular-Datenmodell
      formData: {
        date: '',
        fatigue: null, // Geändert von 0 zu null
        mood: null, // Optional: Ändern, falls auch andere Felder optional sein sollen
        pain: null,
        weight: null,
        sleep: '',
        heartRate: null,
        calories: null,
        protein: null,
        carb: null,
        fat: null,
        water: null,
        steps: null,
        url: ''
      },
      dateInPast: false, // Hinzugefügt, um zu verfolgen, ob das Datum in der Vergangenheit liegt
      checkInExists: false,
    };
  },
  methods: {
    toggleForm() {
      this.isFormOpen = !this.isFormOpen;
    },
    validateDate() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(this.formData.date);
      if (inputDate < today) {
        this.dateInPast = true; // Setzt die Warnung, dass das Datum in der Vergangenheit liegt
      } else {
        this.dateInPast = false; // Setzt zurück, falls das Datum gültig ist
      }
    },
    submitForm() {
      // Headers für die Fetch-Anfrage
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // Stellen Sie sicher, dass Sie das tatsächliche Token aus dem Vuex Store verwenden
      const token = this.$store.state.token.access_token; // Angenommen, Ihr Token wird hier gespeichert
      myHeaders.append("Authorization", `Bearer ${token}`);

      // Konvertiert die Formulardaten in JSON
      const raw = JSON.stringify(this.formData);

      // Konfiguriert die Anfrageoptionen
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      // Sendet die Anfrage
      fetch(`https://gainguru.onrender.com/api/user/${this.$store.state.userId}/checkIn`, requestOptions)
          .then(response => {
            if (response.status === 403) {
              this.checkInExists = true; // Setzt die Warnung, dass ein CheckIn für den Tag bereits vorhanden ist
              throw new Error('Ein CheckIn für den Tag ist bereits vorhanden');
            } else {
              this.checkInExists = false; // Setzt zurück, falls der CheckIn erfolgreich hinzugefügt wurde
              return response.json();
            }
          })
          .then(result => {
            this.$emit('checkInAdded');
          })
          .catch(error => {
            console.log('error', error);
          });
    }
  }
}
</script>


<style scoped>
.checkIn-form {
  background-color: #ffffff;
  border-radius: 8px; /* Ecken abrunden */
  overflow: hidden;
  margin: 20px auto; /* Zentriert das Formular horizontal mit automatischen Seitenrändern */
  max-width: 80%; /* Maximale Breite des Formulars auf 80% festlegen */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.checkIn-form:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkIn-form .form-group {
  margin: 0;
  padding: 15px;
  border-bottom: 1px solid #eaecef; /* Leichte Linien für die Trennung der Daten */
}

.checkIn-form .form-group:last-child {
  border-bottom: none; /* Entfernt die untere Border der letzten Gruppe */
}

.checkIn-form label {
  font-weight: 600;
  color: #495057;
}

.checkIn-form input, .checkIn-form button {
  width: 100%;
  padding: 8px;
  margin-top: 5px; /* Abstand zwischen Label und Input */
  border: none;
  border-radius: 4px;
}

.checkIn-form button[type="submit"] {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border: none;
  margin-top: 15px; /* Zusätzlicher Abstand vor dem Absenden-Button */
  cursor: pointer;
}

.checkIn-form button[type="submit"]:hover {
  background-color: #0056b3;
}

.checkIn-form a {
  color: #007bff;
  text-decoration: none;
}

.checkIn-form a:hover {
  text-decoration: underline;
}
.checkIn-form {
  position: relative;
  /* Rest des Codes... */
}

button no-border {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.toggle-form-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0; /* Removes default padding */
}

.toggle-form-image {
  width: 20px;
  height: 20px;
}
.checkIn-form .alert {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>

