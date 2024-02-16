<template>
  <nav class="navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">CheckIn App</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav mr-auto">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link class="nav-link" to="/about">CheckIn</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar'
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
}
</style>
