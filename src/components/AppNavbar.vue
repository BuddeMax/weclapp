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
          <router-link class="nav-link" to="/checkIn">CheckIn</router-link>
          <router-link class="nav-link" to="/profile">Profile</router-link>
          <router-link class="nav-link" to="/" @click="logout">Logout</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  methods: {
    logout() {
      // Annahme, dass der Token aus einer Authentifizierungsquelle, z.B. Vuex, localStorage oder einer ähnlichen Quelle stammt
      const token = this.$store.state.token.access_token; // Angenommen, Ihr Token wird hier gespeichert

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var raw = "";

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://localhost:8000/api/v1/auth/logout", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result);
            this.$store.commit('setAuthentication', false);
            // Navigieren Sie zur Login-Seite nach erfolgreichem Logout
            this.$router.push('/login');
          })
          .catch(error => console.log('error', error));
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
}
</style>

