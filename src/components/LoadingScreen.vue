<template>
  <div class="loading-overlay">
    <div class="loading-box">
      <h2 class="loading-message">Lädt</h2>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>

</script>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
h2 {
  text-align: center;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 50%; /* Begrenzt die Breite der Box auf 50% der Bildschirmbreite */
  margin-left: auto; /* Zentriert die Box horizontal */
  margin-right: auto; /* Zentriert die Box horizontal */
}

.loading-message {
  color: black;
  font-size: 20px;
}

.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;
}

.loading-message {
  animation: pulse 2s infinite;
}
</style>
