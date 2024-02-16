<template>
  <form class="input-container" @submit.prevent="submitForm">
    <h2>Check-In Input</h2>
    <div class="dates-container">
      <div class="date-input">
        <label for="startDate">Startdatum:</label>
        <input type="date" id="startDate" v-model="startDate" required>
      </div>
      <div class="date-input">
        <label for="endDate">Enddatum:</label>
        <input type="date" id="endDate" v-model="endDate" required>
      </div>
      <div class="checkbox-input">
        <label for="weeklyCheckIn">Wöchentlichen Check-In anzeigen:</label>
        <input type="checkbox" id="weeklyCheckIn" v-model="weeklyCheckIn">
      </div>
      <button type="submit" class="submit-btn">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const startDate = ref(store.state.startDate);
const endDate = ref(store.state.endDate);
const weeklyCheckIn = ref(store.state.weeklyCheckIn);

watch(startDate, newDate => { store.commit('setStartDate', newDate); });
watch(endDate, newDate => { store.commit('setEndDate', newDate); });
watch(weeklyCheckIn, newValue => { store.commit('setWeeklyCheckIn', newValue); });

const submitForm = () => {
  store.state.checkInInput = true;
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  padding: 30px;
  border-radius: 15px; /* Vergrößerte abgerundete Ecken */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin: 40px auto;
  max-width: 80%; /* Begrenzt die Breite des Formulars */
}

form:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  width: 100%;
  text-align: center;
}

.input-container, .dates-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.date-input, .checkbox-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

input[type="date"], input[type="checkbox"] {
  padding: 12px;
  border-radius: 8px; /* Abgerundete Ecken für Eingabefelder */
  border: 1px solid #ced4da;
  background-color: #e9ecef;
}

input[type="date"]:focus, input[type="checkbox"]:focus {
  border-color: #80bdff;
  outline: none;
}

button {
  padding: 12px 25px;
  border-radius: 8px; /* Abgerundete Ecken für den Button */
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

label {
  color: #6c757d;
  font-size: 16px;
}
</style>

