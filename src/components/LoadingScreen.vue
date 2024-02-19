<template>
  <div class="loading-box">
    <h2>Bitte warten</h2>
  </div>
</template>

<script>

</script>

<style>
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
</style>
