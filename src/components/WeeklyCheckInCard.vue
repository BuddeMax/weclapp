<template>
  <div class="weekly-checkIn-card">
    <table>
      <!-- Die Check-In Daten für jeden Eintrag -->
      <tr>
        <td>{{ weeklyCheckIn.fromDate }} to {{weeklyCheckIn.toDate}}</td>
        <td>{{ weeklyCheckIn.fatigue }}</td>
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
  background-color: #8BB3FF;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px auto;
  max-width: 80%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.weekly-checkIn-card table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  table-layout: fixed;
}

.weekly-checkIn-card th, .weekly-checkIn-card td {
  padding: 15px;
  text-align: left;
  color: #495057;
  border-bottom: 1px solid #eaecef;
}

.weekly-checkIn-card th {
  background-color: #0056b3;
  color: white;
  font-weight: 600;
  border: none;
}

.weekly-checkIn-card tr {
  border-radius: 0;
}

.weekly-checkIn-card tr:nth-child(even) {
  background-color: #f8f9fa;
}

.weekly-checkIn-card tr:hover {
  background-color: #e8f0fe;
}

.weekly-checkIn-card tr:last-child td {
  border-bottom: none;
}

/* Stellt sicher, dass TH- und TD-Zellen ohne Verschiebung ausgerichtet sind */
.weekly-checkIn-card th, .weekly-checkIn-card td {
  border-collapse: collapse;
}

/* Entfernt den Zwischenraum zwischen den Tabellen */
.weekly-checkIn-card table + table {
  margin-top: 0;
}

/* Optional: Falls Sie eine Header-Zeile für die wöchentlichen Daten wollen */
.weekly-checkIn-card thead th {
  background-color: #007bff; /* Dunklere Farbe für den Header */
  color: white;
}

/* Optional: Stil für die Zellen der letzten Spalte */
.weekly-checkIn-card td:last-child {
  text-align: center;
  font-style: italic;
}
</style>
