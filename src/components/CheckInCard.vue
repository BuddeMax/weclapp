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
        <td data-label="Date">{{ new Date(checkIn.date).toLocaleDateString('de-DE') }}</td>        <td data-label="Fatigue">{{ checkIn.fatigue }}</td>
        <td data-label="Mood">{{ checkIn.mood }}</td>
        <td data-label="Pain">{{ checkIn.pain }}</td>
        <td data-label="Weight">{{ checkIn.weight }}</td>
        <td data-label="Sleep">{{ checkIn.sleep }}</td>
        <td data-label="HeartRate">{{ checkIn.heartRate }}</td>
        <td data-label="Calories">{{ checkIn.calories }}</td>
        <td data-label="Protein">{{ checkIn.protein }}</td>
        <td data-label="Carbs">{{ checkIn.carb }}</td>
        <td data-label="Fat">{{ checkIn.fat }}</td>
        <td data-label="Water">{{ checkIn.water }}</td>
        <td data-label="Steps">{{ checkIn.steps }}</td>
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
      default: true // Standardmäßig wird der Header angezeigt
    }
  }
}
</script>

<style scoped>

.checkIn-card {
  background-color: #ffffff;
  border-radius: 20px !important;
  margin-left: 30px !important;
  margin: 20px;
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
  width: 1500px; /* Stellt die Tabelle auf volle Breite ein */
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
  background-color: #fff;
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




</style>