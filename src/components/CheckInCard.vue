<template>
  <div class="checkIn-card">
    <table v-if="showHeader">
      <tr>
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
      <!-- Die Check-In Daten für jeden Eintrag -->
      <tr>
        <td>{{ checkIn.date }}</td>
        <td>{{ checkIn.fatigue }}</td>
        <td>{{ checkIn.mood }}</td>
        <td>{{ checkIn.pain }}</td>
        <td>{{ checkIn.weight }}</td>
        <td>{{ checkIn.sleep }}</td>
        <td>{{ checkIn.heartRate }}</td>
        <td>{{ checkIn.calories }}</td>
        <td>{{ checkIn.protein }}</td>
        <td>{{ checkIn.carb }}</td>
        <td>{{ checkIn.fat }}</td>
        <td>{{ checkIn.water }}</td>
        <td>{{ checkIn.steps }}</td>
        <td><a :href="checkIn.url" target="_blank">Link</a></td>
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
      default: true // Standardmäßig wird der Header angezeigt
    }
  }
}
</script>

<style scoped>
.checkIn-card {
  background-color: #ffffff;
  border-radius: 8px; /* Ecken abrunden */
  overflow: hidden;
  margin: 20px auto; /* Zentriert die Karte horizontal mit automatischen Seitenrändern */
  max-width: 80%; /* Maximale Breite der Karte auf 80% festlegen */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.checkIn-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkIn-card table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed;
}

.checkIn-card th,
.checkIn-card td {
  padding: 15px;
  text-align: left;
  color: #495057;
  border-bottom: 1px solid #eaecef; /* Leichte Linien für die Trennung der Daten */
}

.checkIn-card th {
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border: none; /* Entfernt die Border von TH, um Verschiebungen zu verhindern */
}

.checkIn-card tr {
  border-radius: 0; /* Stellt sicher, dass Zeilen keine abgerundeten Ecken haben */
}

.checkIn-card tr:nth-child(even) {
  background-color: #f8f9fa;
}

.checkIn-card tr:hover {
  background-color: #e8f0fe;
}

.checkIn-card a {
  color: #007bff;
  text-decoration: none;
}

.checkIn-card a:hover {
  text-decoration: underline;
}

.checkIn-card tr:last-child td {
  border-bottom: none; /* Entfernt die untere Border der letzten Zeile */
}

/* Stellt sicher, dass TH- und TD-Zellen ohne Verschiebung ausgerichtet sind */
.checkIn-card th, .checkIn-card td {
  border-collapse: collapse;
}

/* Setzt den Abstand zwischen den Tabellen zurück */
.checkIn-card table + table {
  margin-top: 0;
}
</style>
