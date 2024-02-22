<template>
  <div class="checkIn-card">
    <table v-if="showHeader">
      <tr>
        <th>Edit</th>
        <th>Date</th>
        <th>Fatigue</th>
        <th>Mood</th>
        <th>Pain</th>
        <th>Weight</th>
        <th>Sleep</th>
        <th>Heart Rate</th>
        <th>Calories</th>
        <th>Protein</th>
        <th>Carbs</th>
        <th>Fat</th>
        <th>Water</th>
        <th>Steps</th>
        <th>URL</th>
      </tr>
    </table>
    <table>
      <tr>
        <td data-label="Edit">
          <button @click="toggleEdit" class="checkIn-button">
            <img :src="isEditing ? require('@/assets/correct.png') : require('@/assets/edit.png')" alt="Edit" class="checkIn-img">
          </button>
        </td>
        <td data-label="Date">{{ formatDate(checkIn.date) }}</td>
        <td data-label="Fatigue"><input type="number" v-model="checkIn.fatigue" :disabled="!isEditing" /></td>
        <td data-label="Mood"><input type="text" v-model="checkIn.mood" :disabled="!isEditing" /></td>
        <td data-label="Pain"><input type="number" v-model="checkIn.pain" :disabled="!isEditing" /></td>
        <td data-label="Weight"><input type="number" v-model="checkIn.weight" :disabled="!isEditing" /></td>
        <td data-label="Sleep"><input type="time" v-model="checkIn.sleep" :disabled="!isEditing" /></td>
        <td data-label="HeartRate"><input type="number" v-model="checkIn.heartRate" :disabled="!isEditing" /></td>
        <td data-label="Calories"><input type="number" v-model="checkIn.calories" :disabled="!isEditing" /></td>
        <td data-label="Protein"><input type="number" v-model="checkIn.protein" :disabled="!isEditing" /></td>
        <td data-label="Carbs"><input type="number" v-model="checkIn.carb" :disabled="!isEditing" /></td>
        <td data-label="Fat"><input type="number" v-model="checkIn.fat" :disabled="!isEditing" /></td>
        <td data-label="Water"><input type="number" v-model="checkIn.water" :disabled="!isEditing" /></td>
        <td data-label="Steps"><input type="number" v-model="checkIn.steps" :disabled="!isEditing" /></td>
        <td data-label="Url"><a :href="checkIn.url" target="_blank">Link</a></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    checkIn: {
      type: Object,
      required: true
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isEditing: false, // Verwaltet den Zustand der Editierbarkeit
    }
  },
  methods: {
    toggleEdit() {
      if (this.isEditing) {
        // PUT Request nur ausführen, wenn der Bearbeitungsmodus beendet wird
        this.updateCheckIn();
      }
      this.isEditing = !this.isEditing;
    },
    updateCheckIn() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const token = this.$store.state.token.access_token; // Angenommen, Ihr Token wird hier gespeichert
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify(this.checkIn);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      // Die URL muss dynamisch auf die ID des aktuellen CheckIns angepasst werden
      fetch(`https://gainguru.onrender.com/api/user/${this.$store.state.userId}/checkIn/${this.checkIn.id}`, requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE');
    }
  }
}
</script>



<style scoped>

.checkIn-card {
  width: 80%;
  background-color: #ffffff;
  border-radius: 20px !important;
  margin: auto !important; /* Center the card */
  margin-bottom: 20px !important;
  margin-top: 20px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.checkIn-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Stil für die Tabelle und Zellen */
.checkIn-card table {
  overflow: hidden;
  border-radius: 10px;
  width: 100%; /* Stellt die Tabelle auf volle Breite ein */
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed; /* Erlaubt der Tabelle, die Spaltenbreite dynamisch anzupassen */
}

.checkIn-card th,
.checkIn-card td {
  padding: 15px;
  text-align: left;
  color: #495057;
  border-bottom: 1px solid #eaecef;
  overflow: hidden; /* Verhindert Überlaufen des Inhalts */
  white-space: nowrap; /* Text wird in einer einzigen Zeile gehalten */
  text-overflow: ellipsis; /* Fügt "..." hinzu, wenn der Text überläuft */
}

.checkIn-card th {
  background-color: #007bff;
  color: white;
  font-weight: 600;
}

.checkIn-card tr {
  background-color: #ffffff;
}

.checkIn-card tr:nth-child(even) {
  background-color: #f8f9fa;
}

.checkIn-card tr:hover {
  background-color: #e8f0fe;
}


.checkIn-card a {
  color: #000000;
  text-decoration: none;
}
.checkIn-button {
  border-radius: 4px;
  border: none;
  background-color: transparent; /* Set background to transparent */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.checkIn-img{
  width: 20px;
  height: 20px;
}

/* Allgemeine Stile für input Elemente */
.checkIn-card input[type="number"], .checkIn-card input[type="text"] {
  background-color: transparent; /* Weißer Hintergrund */
  color: #495057; /* Dunkelgraue Schrift */
  border: none; /* Entfernt den Standard-Rahmen */
}

/* Stile für input Elemente im Fokus */
.checkIn-card input[type="number"]:focus, .checkIn-card input[type="text"]:focus {
  outline: none; /* Entfernt den Standard-Fokus-Rahmen */
  border: none;
  background-color: #88bfff; /* Heller grauer Hintergrund */
  border-radius: 4px;
  transition: background-color 0.3s ease;
  width: 75px
}

/* Stile für input Elemente, wenn sie deaktiviert sind */
.checkIn-card input[type="number"]:disabled, .checkIn-card input[type="text"]:disabled {
  background-color: transparent; /* Heller grauer Hintergrund */
  color: #495057; /* Graue Schrift */
  border: none;
}

/* Stil für Zeit-Inputfelder */
.checkIn-card input[type="time"] {
  border: none; /* Entfernt den Standard-Rahmen */
  background-color: transparent; /* Hintergrundfarbe */
  color: #495057; /* Textfarbe */
}

/* Stil für Zeit-Inputfelder beim Fokussieren */
.checkIn-card input[type="time"]:focus {
  outline: none; /* Standardumriss entfernen */
  border: none;

}

/* Stil für deaktivierte Zeit-Inputfelder */
.checkIn-card input[type="time"]:disabled {
  background-color: transparent; /* Hintergrundfarbe für deaktivierte Felder */
  color: #495057; /* Textfarbe für deaktivierte Felder */
}



@media (max-width: 600px) {
  .checkIn-card {
    width: 80%; /* Adjusted to use full width of its container */
    background-color: #ffffff;
    border-radius: 20px !important;
    margin-left: 30px !important;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
  .checkIn-card table {
    overflow: hidden;
    border-radius: 10px;
    width: 1500px; /* Stellt die Tabelle auf volle Breite ein */
    border-collapse: collapse;
    margin: 0;
    padding: 0;
    table-layout: fixed; /* Erlaubt der Tabelle, die Spaltenbreite dynamisch anzupassen */
  }
}

</style>
