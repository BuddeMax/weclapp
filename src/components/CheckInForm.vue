<template>
  <div class="checkIn-form">
    <button class="toggle-form-button" @click="toggleForm">
      <img :src="isFormOpen ? require('@/assets/up-and-down-arrow.png') : require('@/assets/down-and-up-arrow.png')" alt="Toggle Form" class="toggle-form-image">
    </button>
    <form v-if="isFormOpen" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="date">Datum:</label>
        <input type="date" id="date" v-model="formData.date" required>
      </div>
      <div class="form-group">
        <label for="fatigue">Müdigkeit (1-10):</label>
        <input type="number" id="fatigue" v-model="formData.fatigue" min="1" max="10" required>
      </div>
      <div class="form-group">
        <label for="mood">Stimmung (1-10):</label>
        <input type="number" id="mood" v-model="formData.mood" min="1" max="10" required>
      </div>
      <div class="form-group">
        <label for="pain">Schmerz (1-10):</label>
        <input type="number" id="pain" v-model="formData.pain" min="1" max="10" required>
      </div>
      <div class="form-group">
        <label for="weight">Gewicht (kg):</label>
        <input type="number" id="weight" v-model="formData.weight" step="0.1" required>
      </div>
      <div class="form-group">
        <label for="sleep">Schlaf (hh:mm):</label>
        <input type="time" id="sleep" v-model="formData.sleep" required>
      </div>
      <div class="form-group">
        <label for="heartRate">Herzrate:</label>
        <input type="number" id="heartRate" v-model="formData.heartRate" required>
      </div>
      <div class="form-group">
        <label for="calories">Kalorien:</label>
        <input type="number" id="calories" v-model="formData.calories" required>
      </div>
      <div class="form-group">
        <label for="protein">Protein (g):</label>
        <input type="number" id="protein" v-model="formData.protein" required>
      </div>
      <div class="form-group">
        <label for="carb">Kohlenhydrate (g):</label>
        <input type="number" id="carb" v-model="formData.carb" required>
      </div>
      <div class="form-group">
        <label for="fat">Fett (g):</label>
        <input type="number" id="fat" v-model="formData.fat" required>
      </div>
      <div class="form-group">
        <label for="water">Wasser (ml):</label>
        <input type="number" id="water" v-model="formData.water" required>
      </div>
      <div class="form-group">
        <label for="steps">Schritte:</label>
        <input type="number" id="steps" v-model="formData.steps" required>
      </div>
      <div class="form-group">
        <label for="url">URL:</label>
        <input type="url" id="url" v-model="formData.url">
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
        fatigue: 0,
        mood: 0,
        pain: 0,
        weight: 0,
        sleep: '',
        heartRate: 0,
        calories: 0,
        protein: 0,
        carb: 0,
        fat: 0,
        water: 0,
        steps: 0,
        url: ''
      }
    };
  },
  methods: {
    toggleForm() {
      this.isFormOpen = !this.isFormOpen;
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
          .then(response => response.json()) // Geändert zu .json() für ein JSON-Antwortformat
          .then(result => {
            this.$emit('checkInAdded');
            // Hier könnte man z.B. eine Erfolgsmeldung anzeigen
          })
          .catch(error => {
            console.log('error', error);
            // Hier könnte man z.B. eine Fehlermeldung anzeigen
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
</style>

