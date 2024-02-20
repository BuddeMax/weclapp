<template>
  <div class="weekly-checkIn-card">
    <table>
      <!-- Die Check-In Daten für jeden Eintrag -->
      <tr>
        <td class="Date">{{ new Date(weeklyCheckIn.fromDate).toLocaleDateString('de-DE') }} to {{new Date(weeklyCheckIn.toDate).toLocaleDateString('de-DE')}}</td>        <td>{{ weeklyCheckIn.fatigue }}</td>
        <td>{{ weeklyCheckIn.mood }}</td>
        <td>{{ weeklyCheckIn.pain }}</td>
        <td>{{ weeklyCheckIn.weight }}</td>
        <td>{{ weeklyCheckIn.sleep }}</td>
        <td>{{ weeklyCheckIn.heartRate }}</td>
        <td>{{ weeklyCheckIn.calories }}</td>
        <td>{{ weeklyCheckIn.protein }}</td>
        <td>{{ weeklyCheckIn.carb }}</td>
        <td>{{ weeklyCheckIn.fat }}</td>
        <td>{{ weeklyCheckIn.water }}</td>
        <td>{{ weeklyCheckIn.steps }}</td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    weeklyCheckIn: {
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

.weekly-checkIn-card {
  background-color: #ffffff;
  border-radius: 20px !important;
  margin-left: 30px !important;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.weekly-checkIn-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Stil für die Tabelle und Zellen */
.weekly-checkIn-card table {
  overflow: hidden;
  border-radius: 10px;
  width: 1500px; /* Stellt die Tabelle auf volle Breite ein */
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed; /* Erlaubt der Tabelle, die Spaltenbreite dynamisch anzupassen */
}

.weekly-checkIn-card th,
.weekly-checkIn-card td {
  padding: 15px;
  text-align: left;
  color: #495057;
  border-bottom: 1px solid #eaecef;
  overflow: hidden; /* Verhindert Überlaufen des Inhalts */
  white-space: nowrap; /* Text wird in einer einzigen Zeile gehalten */
  text-overflow: ellipsis; /* Fügt "..." hinzu, wenn der Text überläuft */
}

.weekly-checkIn-card th {
  background-color: #007bff;
  color: white;
  font-weight: 600;
}

.weekly-checkIn-card tr {
  background-color: #88bfff;
}

.weekly-checkIn-card tr:nth-child(even) {
  background-color: #f8f9fa;
}

.weekly-checkIn-card tr:hover {
  background-color: #e8f0fe;
}

.weekly-checkIn-card a {
  color: #007bff;
  text-decoration: none;
}

.weekly-checkIn-card .Date {
  white-space: normal; /* Erlaubt den Text, auf die nächste Zeile zu überlaufen */
  height: 50px; /* Stellt sicher, dass genug Platz für zwei Zeilen vorhanden ist */
}



</style>