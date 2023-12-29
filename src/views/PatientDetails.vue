<template>
  <div class="container">
    <div v-if="patient" class="patient-details">
      <header class="patient-header">
        <h1>{{ patient.name }}, {{ patient.firstname }}</h1>
      </header>

      <section class="patient-info">
        <div class="info-box">
          <span>Age: {{ patient.age }}</span>
          <span>Birth Date: {{ patient.birthDate }}</span>
          <span>Gender: {{ patient.gender }}</span>
          <span>Note: {{ patient.note || "N/A" }}</span>
        </div>
      </section>

      <section class="patient-todos">
        <h2>Patiententodos</h2>
        <button class="btn" @click="toggleTodoForm">Todo hinzufügen</button>
        <form v-if="showTodoForm" @submit.prevent="addTodo" class="todo-form">
          <label>
            Beschreibung:
            <input v-model="newTodo.beschreibung" required />
          </label>
          <label>
    Priorität:
    <select v-model="newTodo.prioritaet" required>
      <option value="">Bitte wählen</option>
      <option value="niedrig">Niedrig</option>
      <option value="mittel">Mittel</option>
      <option value="hoch">Hoch</option>
    </select>
  </label>
  
          <button class="btn">Todo hinzufügen</button>
        </form>
        <table class="todo-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Beschreibung</th>
              <th>Priorität</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="todo in sortedTodos" :key="todo.toDoId">
    <td>
      <input type="checkbox" :checked="todo.status === 'erledigt'" @change="toggleTodoStatus(todo)">
    </td>
    <td :class="{ 'todo-done': todo.status === 'erledigt' }">{{ todo.beschreibung }}</td>
    <td>{{ todo.prioritaet }}</td>
    <td>
      <button class="btn btn-delete" @click="deleteTodo(todo.toDoId)">
        Löschen
      </button>
    </td>
  </tr>
</tbody>
        </table>
      </section>

      <section class="patient-files">
        <h2>Patientenfiles</h2>
        <button class="btn" @click="toggleFileForm">Datei hinzufügen</button>
        <form v-if="showForm" @submit.prevent="addFile" class="file-form">
          <label>
            Dateiname:
            <input v-model="newFile.fileName" required />
          </label>
          <label>
            Dateipfad:
            <input v-model="newFile.filePath" required />
          </label>
          <label>
            Beschreibung:
            <textarea v-model="newFile.description" required></textarea>
          </label>
          <button class="btn">Datei hinzufügen</button>
        </form>
        <table class="file-table">
          <thead>
            <tr>
              <th>Dateiname</th>
              <th>Dateipfad</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in files" :key="file.id">
              <td>{{ file.fileName }}</td>
              <td>
                <a :href="file.filePath" target="_blank">{{ file.filePath }}</a>
              </td>
              <td>
                <button class="btn btn-delete" @click="deleteFile(file.id)">
                  Löschen
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>


<script>
import PatientService from "../store/PatientService";
import axios from "axios";
import PatientFiles from "../components/PatientFiles.vue"; // Import der Komponente

export default {
  name: "PatientDetails",
  data() {
    return {
      patient: null,
      files: [],
      showForm: false,
      newFile: {
        fileName: "",
        filePath: "",
        description: "",
      },
      todos: [],
      showTodoForm: false,
      newTodo: {
        beschreibung: "",
        prioritaet: "",
        status: "",
      },
    };
  },
  methods: {
    toggleFileForm() {
    this.showForm = !this.showForm;
  },
  toggleTodoForm() {
    this.showTodoForm = !this.showTodoForm;
  },
  toggleTodoStatus(todo) {
  const newStatus = todo.status === 'erledigt' ? 'offen' : 'erledigt';
  fetch(`http://localhost:8080/todo/${todo.toDoId}/status/${newStatus}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
  })
  .then(() => {
    this.loadPatientTodos(); // Lädt die Todo-Liste erneut, um die Änderungen anzuzeigen
  })
  .catch((error) => {
    console.error("Error updating todo status:", error);
  });
},
    async loadPatientDetails() {
      try {
        const patientId = this.$route.params.id;
        const response = await PatientService.getPatient(patientId);
        this.patient = response.data;
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    },
    async loadPatientFiles() {
      try {
        const patientId = this.$route.params.id;
        const response = await axios.get(
          `http://localhost:8080/patient/${patientId}/files`
        );
        this.files = response.data;
      } catch (error) {
        console.error("Error fetching patient files:", error);
      }
    },
    async deleteFile(fileId) {
      try {
        const patientId = this.$route.params.id;
        await axios.delete(
          `http://localhost:8080/file/${fileId}/patient/${patientId}`
        );
        this.loadPatientFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    },
    addFile() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newFile),
        redirect: "follow",
      };

      fetch("http://localhost:8080/file", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // Aufruf der assignFileToPatient Methode mit der ID der gerade hinzugefügten Datei
          this.assignFileToPatient(result.id).then(() => {
            this.loadPatientFiles();
            this.showForm = false;
            this.resetNewFile();
          });
        })
        .catch((error) => {
          console.error("Error adding file:", error);
        });
    },

    assignFileToPatient(fileId) {
      if (!this.patient || !this.patient.id) {
        console.error("Patient ID is not available");
        return Promise.reject("Patient ID is not available");
      }

      const requestOptions = {
        method: "PUT", // PUT Methode zum Zuordnen der Datei
        body: "",
        redirect: "follow",
      };

      return fetch(
        `http://localhost:8080/file/${fileId}/patient/${this.patient.id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log("File assigned to patient:", result))
        .catch((error) =>
          console.error("Error assigning file to patient:", error)
        );
    },

    resetNewFile() {
      this.newFile = {
        fileName: "",
        filePath: "",
        description: "",
      };
    },

    async loadPatientTodos() {
      try {
        const patientId = this.$route.params.id;
        const response = await fetch(
          `http://localhost:8080/patient/${patientId}/todos`,
          {
            method: "GET", // Changed from PUT to GET to fetch data
            redirect: "follow",
          }
        );
        if (response.ok) {
          this.todos = await response.json(); // Update todos with the fetched data
        } else {
          throw new Error("Failed to fetch todos");
        }
      } catch (error) {
        console.error("Error fetching patient todos:", error);
      }
    },
    async deleteTodo(todoId) {
      try {
        const patientId = this.$route.params.id;
        await fetch(
          `http://localhost:8080/todo/${todoId}/patient/${patientId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            redirect: "follow",
          }
        );
        this.loadPatientTodos(); // Lädt die Todo-Liste erneut, um die Änderungen anzuzeigen
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    },
    async addTodo() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newTodo),
        redirect: "follow",
      };

      fetch("http://localhost:8080/todo", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          //test
          // Aufruf der assignFileToPatient Methode mit der ID der gerade hinzugefügten Datei
          this.assignTodoToPatient(result.toDoId).then(() => {
            this.loadPatientTodos();
            this.showForm = false;
            this.resetNewTodo();
          });
        })
        .catch((error) => {
          console.error("Error adding file:", error);
        });
    },
    assignTodoToPatient(todoId) {
      if (!this.patient || !this.patient.id) {
        console.error("Patient ID is not available");
        return Promise.reject("Patient ID is not available");
      }

      const requestOptions = {
        method: "PUT", // PUT Methode zum Zuordnen der Datei
        body: "",
        redirect: "follow",
      };

      return fetch(
        `http://localhost:8080/todo/${todoId}/patient/${this.patient.id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log("File assigned to patient:", result))
        .catch((error) =>
          console.error("Error assigning file to patient:", error)
        );
    },

    resetNewTodo() {
      this.newTodo = {
        beschreibung: "",
        prioritaet: "",
        status: "",
      };
    },
  },
  computed: {
    sortedTodos() {
      const priorityMap = { 'hoch': 1, 'mittel': 2, 'niedrig': 3 };

      return this.todos.slice().sort((a, b) => {
        if (a.status === 'erledigt' && b.status === 'erledigt') return 0;
        if (a.status === 'erledigt') return 1;
        if (b.status === 'erledigt') return -1;
        return priorityMap[a.prioritaet] - priorityMap[b.prioritaet];
      });
    }
  },
  created() {
    this.loadPatientDetails();
    this.loadPatientFiles();
    this.loadPatientTodos();
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.patient-header h2 {
  margin-bottom: 20px;
}

.info-box span {
  display: block;
  margin-bottom: 10px;
}

.file-table, .todo-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.file-table th, .file-table td, .todo-table th, .todo-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.file-table th, .todo-table th {
  background-color: #f2f2f2;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.todo-done {
  text-decoration: line-through;
}

@media screen and (min-width: 1024px) {
  .container {
    width: 80%;
    margin: 0 auto;
  }
}

.todo-form, .file-form {
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa; /* Hintergrundfarbe des Formulars */
  margin-bottom: 20px;
}

@media screen and (min-width: 1024px) {
  .todo-form, .file-form {
    width: 50%; /* Formularbreite auf 50% setzen */
    margin: 0 auto; /* Zentrieren des Formulars */
  }
}

/* Stile für Buttons */
.btn {
  margin: 10px; /* Abstand um die Schaltflächen hinzufügen */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>

