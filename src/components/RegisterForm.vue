<template>
  <div>
    <h2>Create Account</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="firstname">First name</label>
        <input type="text" id="firstname" v-model="firstname" required>
      </div>
      <div>
        <label for="lastname">Last name</label>
        <input type="text" id="lastname" v-model="lastname" required>
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Create Account</button>
      <div>OR</div>
      <button type="button">Sign up with Google</button>
      <p>Bereits ein Account ?</p>
      <router-link class="nav-link" to="/login">Login</router-link>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      token:{
        access_token: '',
        refresh_token: ''
      }
    };
  },
  methods: {
    submitForm() {
      setTimeout(this.sendRequest, 1000);
    },
    async sendRequest() {
      const url = 'https://gainguru.onrender.com/api/v1/auth/register';
      const user = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      this.token = await response.json();
      console.log(`JWT Token: ${this.token.access_token}`);
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
