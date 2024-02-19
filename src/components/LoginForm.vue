<template>
  <div>
    <form @submit.prevent="submitForm">
      <h2>Login</h2>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
      <p>Noch kein Account ?</p>
      <router-link class="nav-link" to="/register">Register</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    submitForm() {
      this.sendRequest();
    },
    async sendRequest() {
      const loginUrl = 'https://gainguru.onrender.com/api/v1/auth/authenticate';
      const userInfoUrl = 'https://gainguru.onrender.com/api/user/me'; // URL, um Benutzerinformationen zu fetchen
      const user = {
        email: this.email,
        password: this.password
      };

      try {
        // Anfrage zum Einloggen und Erhalten des Tokens
        const loginResponse = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });

        if (!loginResponse.ok) {
          const message = `Ein Fehler ist aufgetreten: ${loginResponse.status}`;
          throw new Error(message);
        }

        const token = await loginResponse.json();
        this.$store.commit('setAuthentication', true);
        this.$store.commit('setToken', token);
        this.$store.commit('setEmail', this.email);

        // Nach erfolgreichem Login, fetchen Sie Benutzer-ID
        await this.fetchUserId(token.access_token, userInfoUrl);

        // Weiterleitung zur Home-Seite
        this.$router.push({ name: 'Home' });
      } catch (error) {
        console.error(error);
        this.$store.commit('setAuthentication', false);
      }
    },
    async fetchUserId(token, userInfoUrl) {
      try {
        const response = await fetch(userInfoUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Fehler beim Abrufen der Benutzer-ID: ${response.statusText}`);
        }

        const userData = await response.json();
        // Speichern Sie die Benutzer-ID im Vuex Store
        this.$store.commit('setUserId', userData);
        // logge nun die gestorte id
      } catch (error) {
        console.error(`Fehler beim Fetchen der Benutzer-ID: ${error}`);
      }
    },
  },
};
</script>



<style scoped>
form {
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

form:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  margin-bottom: 20px;
  color: #495057;
  font-size: 24px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

input[type="text"], input[type="email"], input[type="password"] {
  width: calc(100% - 20px);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  background-color: #e9ecef;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus {
  border-color: #80bdff;
  outline: none;
}

button {
  padding: 12px 25px;
  border-radius: 8px;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

label {
  align-self: flex-start;
  color: #6c757d;
  font-size: 16px;
}
</style>
