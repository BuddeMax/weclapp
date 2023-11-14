<template>
  <div>
    <Patient />
  </div>
</template>

<script>
import Patient from './components/Patient.vue'

export default {
  name: 'App',
  components: {
    Patient
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

