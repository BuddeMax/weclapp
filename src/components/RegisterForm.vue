<template>
  <div>
    <form @submit.prevent="submitForm">
      <h2>Create Account</h2>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="input-container">
        <label for="firstname">First name</label>
        <input type="text" id="firstname" v-model="firstname" required>
      </div>
      <div class="input-container">
        <label for="lastname">Last name</label>
        <input type="text" id="lastname" v-model="lastname" required>
      </div>
      <div class="input-container">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="input-container">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Create Account</button>
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
      errorMessage: '', // Füge eine neue Datenproperty für die Fehlermeldung hinzu
    };
  },
  methods: {
    async submitForm() {
      const url = 'https://gainguru.onrender.com/api/v1/auth/register';
      const user = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          // Überprüfe den Statuscode der Antwort
          if (response.status === 403) {
            this.errorMessage = 'Email-Adresse bereits vergeben. Bitte verwenden Sie eine andere Email-Adresse.';
          } else {
            throw new Error(`An error has occured: ${response.status}`);
          }
        } else {
          // Emit an event to signal successful registration
          this.$emit('registration-success');
        }
      } catch (error) {
        console.error(error);
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

.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  color: #6c757d;
  font-size: 16px;
  margin-bottom: 5px; /* Etwas Abstand zwischen Label und Input */
}

.error-message {
  color: red;
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
}

/* Media Queries für Handys */
@media (max-width: 600px) {
  form {
    padding: 20px;
    gap: 15px;
    margin: 20px auto;
    max-width: 90%; /* Anpassung der maximalen Breite für kleinere Bildschirme */
  }

  .input-container {
    width: 100%; /* Stellt sicher, dass die Container die angepasste Formularbreite nutzen */
  }

  input[type="text"], input[type="email"], input[type="password"], button {
    width: calc(100% - 24px); /* Anpassung der Breite mit einem kleinen Rand, um nicht die volle Breite zu nutzen */
    padding: 10px;
  }

  label {
    font-size: 14px;
  }
}
</style>
