<template>
    <div class="patient-files">
      <h1>Patientendetails</h1>
      <button class="btn" @click="showForm = !showForm">
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
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "PatientFilesComponent",
    props: ['patientId'],
    data() {
      return {
        files: [],
        showForm: false,
        newFile: {
          fileName: "",
          filePath: "",
          description: "",
        },
      };
    },
    methods: {
      async loadPatientFiles() {
        try {
          const response = await axios.get(
            `http://localhost:8080/patient/${this.patientId}/files`
          );
          this.files = response.data;
        } catch (error) {
          console.error("Error fetching patient files:", error);
        }
      },
      async deleteFile(fileId) {
        try {
          await axios.delete(
            `http://localhost:8080/file/${fileId}/patient/${this.patientId}`
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
    }
    },
    created() {
      this.loadPatientFiles();
    },
  };
  </script>
  
  <style scoped>
  .patient-files {
    /* Stile spezifisch für diese Komponente */
    margin: 20px 0;
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
  </style>
  