<template>
  <div class="container">

    <div v-if="patient">
      <div class="patient-info">
        <h2>{{ patient.name }} {{ patient.firstname }}</h2>

        <div class="row">
          <div class="col-md-4">
            <div class="info-box">
              <strong>Age:</strong>
              <p>{{ patient.age }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="info-box">
              <strong>Birth Date:</strong>
              <p>{{ patient.birthDate }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="info-box">
              <strong>Gender:</strong>
              <p>{{ patient.gender }}</p>
            </div>
          </div>
        </div>

        <div class="info-box">
          <strong>Note:</strong>
          <p>{{ patient.note || "N/A" }}</p>
        </div>

        <table class="file-table">
          <thead>
            <tr>
              <th>Patientendateien</th>
              <th>Todos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="row">
                  <div class="patient-details">
                    <h1>Patientendetails</h1>
                    <button @click="showForm = !showForm">
                      Datei hinzufügen
                    </button>

                    <form v-if="showForm" @submit.prevent="addFile">
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
                        <textarea
                          v-model="newFile.description"
                          required
                        ></textarea>
                      </label>
                      <button type="submit">Datei hinzufügen</button>
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
                            <a :href="file.filePath" target="_blank">{{
                              file.filePath
                            }}</a>
                          </td>
                          <td>
                            <button @click="deleteFile(file.id)">
                              Löschen
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
              <td>
                <!-- Todos Section -->
                <div class="patient-details">
                  <h1>Todos</h1>
                  <button @click="showTodoForm = !showTodoForm">
                    Todo hinzufügen
                  </button>

                  <form v-if="showTodoForm" @submit.prevent="addTodo">
                    <label>
                      Beschreibung:
                      <input v-model="newTodo.beschreibung" required />
                    </label>
                    <label>
                      Priorität:
                      <input v-model="newTodo.prioritaet" required />
                    </label>
                    <label>
                      Status:
                      <input v-model="newTodo.status" required />
                    </label>
                    <button type="submit">Todo hinzufügen</button>
                  </form>

                  <table class="file-table">
                    <thead>
                      <tr>
                        <th>Beschreibung</th>
                        <th>Priorität</th>
                        <th>Status</th>
                        <th>Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="todo in todos" :key="todo.toDoId">
                        <td>{{ todo.beschreibung }}</td>
                        <td>{{ todo.prioritaet }}</td>
                        <td>{{ todo.status }}</td>
                        <td>
                          <button @click="deleteTodo(todo.toDoId)">
                            Löschen
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="row"></div>
      </div>
    </div>
  </div>
</template>

<script>
import PatientService from "../store/PatientService";
import axios from "axios";

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
  created() {
    this.loadPatientDetails();
    this.loadPatientFiles();
    this.loadPatientTodos();
  },
};
</script>

<style scoped>
.patient-info {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.info-box {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
}
.patient-details {
  width: 80%;
  margin: 0 auto;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
}

.file-table th,
.file-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.file-table th {
  background-color: #f2f2f2;
}
</style>
