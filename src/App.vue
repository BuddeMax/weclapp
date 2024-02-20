<template>
  <app-navbar></app-navbar>
  <router-view/>
</template>

<script>
import AppNavbar from './components/AppNavbar' // Geänderter Import


export default {
  name: 'App',
  components: { AppNavbar }
}
</script>



<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0; /* Hellgrau */
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>