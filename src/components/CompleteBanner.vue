<template>
  <div v-if="isRegistered" class="success-banner">
    <h2>Herzlichen Glückwunsch!</h2>
    <p>Sie haben sich erfolgreich registriert.</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Definiere Props
const props = defineProps({
  isRegistered: Boolean
});
</script>

<style scoped>
h2 {
  width: 100%;
  text-align: center;
}
.success-banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #D4EDDA;
  color: #155724;
  padding: 20px;
  border-radius: 5px;
  margin: 10px 0;
  opacity: 0;
  animation: fadeIn 2s forwards;
}

.success-banner.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  max-width: 400px;
  margin: 40px auto;
  transition: box-shadow 0.3s ease;
}

.success-banner.form:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>