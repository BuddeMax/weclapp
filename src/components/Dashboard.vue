<template>
  <div class="container">
    <h1>Weclapp Time Track</h1>
    <button @click="fetchData" >
      <span v-if="dataLoaded">&#10004; Daten geladen</span>
      <span v-else>Daten laden</span>
    </button>
    <div>
      <label for="apiKeyInput">API Key:</label>
      <input
          id="apiKeyInput"
          type="text"
          v-model="apiKey"
          :class="{'collapsed-input': apiKeyConfirmed, 'blurred': apiKeyConfirmed && !apiKeyVisible}"
          @input="updateApiKey"
          @click="apiKeyVisible = true"
          @blur="apiKeyVisible = false"
          class="api-input"
      >
    </div>
    <div>
      <label for="domainInput">Domain:</label>
      <input
          id="domainInput"
          type="text"
          v-model="domain"
          :class="{'collapsed-input': domainConfirmed, 'blurred': domainConfirmed && !domainVisible}"
          @input="updateDomain"
          @click="domainVisible = true"
          @blur="domainVisible = false"
          class="domain-input"
      >
    </div>
    <div>
      <label for="customerSelect">Wähle einen Kunden:</label>
      <select id="customerSelect" v-model="selectedCustomer">
        <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.company }} (ID: {{ customer.id }})</option>
      </select>
    </div>
    <div>
      <label for="salesOrderSelect">Wähle einen Auftrag:</label>
      <select id="salesOrderSelect" v-model="selectedOrder">
        <option v-for="order in salesOrders" :key="order.id" :value="order.id">{{ order.commission }} (ID: {{ order.id }})</option>
      </select>
    </div>
    <div>
      <label for="orderItemSelect">Wähle ein Service:</label>
      <select id="orderItemSelect" v-model="selectedOrderItem">
        <option v-for="item in orderItems" :key="item.id" :value="item.id">{{ item.title }} (ID: {{ item.id }})</option>
      </select>
    </div>
    <div>
      <label for="taskSelect">Wähle eine Aufgabe:</label>
      <select id="taskSelect" v-model="selectedTask">
        <option v-for="task in currentTaskAndSubject" :key="task.taskId" :value="task.taskId">
          {{ task.subject }} (ID: {{ task.taskId }})
        </option>
      </select>
    </div>
    <div>
      <label for="userSelect">Wähle einen User:</label>
      <select id="userSelect" v-model="selectedUser">
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.firstName }} {{ user.lastName }} ({{ user.email }})</option>
      </select>
    </div>
    <div class="file-input">
      <input type="file" id="file" @change="handleFileUpload" accept=".xlsx,.xls,.csv">
      <label for="file">
        <span v-if="fileUploaded">&#10004; Datei hochgeladen</span>
        <span v-else>Datei hochladen</span>
      </label>
    </div>
    <div>
      <button @click="readData">
        <span v-if="dataRead">&#10004; Daten gelesen</span>
        <span v-else>Datei lesen</span>
      </button>
    </div>
    <div>
      <button @click="postAllTimeRecords">Zeiten buchen</button>
    </div>
    <div class="error-dashboard" v-if="issues.length > 0" @click="clearIssues">
      <h2>Fehler Dashboard</h2>
      <div v-for="(issue, index) in issues" :key="index">
        {{ issue }}
      </div>
    </div>
    <div class="finish-dashboard" v-if="postConfirmed">
      <h2>Post Erfolgreich</h2>
    </div>
    <div>
      <h2>Data:</h2>
      <table>
        <thead>
        <tr>
          <th>Startdatum</th>
          <th>Zeit</th>
          <th v-if="hasDescription">Beschreibung</th>
          <th>Dauer in Stunden</th>
          <th>Ort</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.timestamp }}</td>
          <td v-if="hasDescription">{{ item.description || ' ' }}</td> <!-- Anzeige von leeren Zellen wenn keine Beschreibung -->
          <td>{{ item.duration }}</td>
          <td>{{ item.placeOfService }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {reactive, ref, watch} from 'vue';
import * as XLSX from 'xlsx';
import axios, {post} from "axios";
import async from "async";
import { store } from '../store/store.js';
import {convertExcelDateToJSDate} from '../service/utils.js';
import {convertExcelTimeToReadableTime} from '../service/utils.js';
import {convertDurationToUnixTimestamp} from '../service/utils.js';
import {excelDateToUnixTime} from '../service/utils.js';
import {getUnixTimestamp} from '../service/utils.js';
import {fetchCustomer} from '../service/api.js';
import { fetchSalesOrders } from '../service/api.js';





export default {
  created() {
    this.updateDomain();
    this.updateApiKey();
  },
  methods: {
    convertExcelDateToJSDate,
    convertExcelTimeToReadableTime,
    convertDurationToUnixTimestamp,
    excelDateToUnixTime,
    getUnixTimestamp,
    handleFileUpload(event) {
      const fileNameLabel = document.getElementById('file-name');
      const files = event.target.files;
      if (files.length > 0) {
        fileNameLabel.textContent = files[0].name;
      } else {
        fileNameLabel.textContent = 'No file chosen...';
      }
    },
    clearIssues() {
      console.log('clearIssues called, current issues:', this.issues);
      this.issues = [];
      console.log('issues after clearing:', this.issues);
    },
    updateDomain() {
      let domain = localStorage.getItem('domain');
      if (domain) {
        store.commit('setDomain', domain);
      }
    },
    updateApiKey() {
      let apiKey = localStorage.getItem('apiKey');
      if (apiKey) {
        store.commit('setApiKey', apiKey);
      }
    },
    async loadCustomers() {
      try {
        this.customers = await fetchCustomers();
      } catch (error) {
        console.error('Fehler beim Laden der Kunden:', error);
      }
    },
  },
  setup() {
    const file = ref(null);
    const data = ref([]);
    const editedData = ref([]); // halten Sie editedData als ref
    const salesOrders = ref([]);
    const selectedOrder = ref(null);
    const orderItems = ref([]);
    const selectedOrderItem = ref(null);
    const tasks = ref([]);
    const currentTasks = ref([]);  // Hält die Tasks, die zum ausgewählten Order Item gehören
    const currentTaskAndSubject = ref([]);
    const selectedTask = ref(null);
    const users = ref([]);
    const selectedUser = ref(null);
    const message = ref('');
    const apiKey = ref(localStorage.getItem('apiKey') || '');
    const domain = ref(localStorage.getItem('domain') || '');
    const apiKeyConfirmed = ref(!!apiKey.value);  // Bestätigung basierend auf dem Vorhandensein eines Wertes
    const domainConfirmed = ref(!!domain.value);
    const apiKeyVisible = ref(false); // Dieses Ref wird bestimmen, ob das apiKey-Feld unscharf ist oder nicht.
    const domainVisible = ref(false); // Gleiches für das domain-Feld.
    const issues = ref([]);
    const postConfirmed = ref(false);
    const hasDescription = ref(false); // Updated to use a boolean
    const customers = ref([]);
    const selectedCustomer = ref(null);
    const moment = require('moment-timezone');
    const dataLoaded = ref(false);
    const fileUploaded = ref(false);
    const dataRead = ref(false);


    const handleFileUpload = event => {
      file.value = event.target.files[0];
      fileUploaded.value = true;
    };


    const readData = () => {
      if (!file.value) {
        message.value = 'Keine Datei ausgewählt.';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        range.s.r = 4;

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range }).map(item => {
          if (!isNaN(item.Zeit) && !isNaN(item['Dauer in Stunden'])) {

            return {
              date: convertExcelDateToJSDate(item.Datum),
              timestamp: convertExcelTimeToReadableTime(item.Zeit),
              description: item.Beschreibung,
              duration: convertExcelTimeToReadableTime(item['Dauer in Stunden']),
              placeOfService: item['Ort']
            };
          }
        }).filter(item => item !== undefined);
        hasDescription.value = jsonData.some(item => item.description);

        data.value = jsonData;
        console.log('Data read: ', data.value);
        convertData()
      };
      reader.readAsArrayBuffer(file.value);
    };



    const convertData = () => {

      const convertedData = data.value.map(item => ({
        startDate: getUnixTimestamp(item.date, item.timestamp),
        duration: convertDurationToUnixTimestamp(item.duration),
        billableDuration: convertDurationToUnixTimestamp(item.duration),
        placeOfServiceId: Number(item.placeOfService.split(':')[1].trim()),
        description: item.description,
        taskId: selectedTask.value,
        userId: selectedUser.value,
        testDate: excelDateToUnixTime(item.date),
        testTime: convertDurationToUnixTimestamp(item.timestamp)
      }));

      editedData.value = convertedData;

      console.log('Converted data: ', editedData.value);

      dataRead.value = true;
    };

    const loadCustomerData = async () => {
      let customersData = await fetchCustomer(apiKey.value, domain.value);
      while (!customersData || customersData.length === 0) {
        console.log('Keine Kundendaten gefunden, versuche erneut...');
        customersData = await fetchCustomer(apiKey.value, domain.value);
      }
      customers.value = customersData;
      console.log('Customer data loaded successfully');
      setTimeout(() => {
        dataLoaded.value = true;
      }, 100);
    };

    const loadSalesOrdersData = async () => {
      const salesOrdersData = await fetchSalesOrders(apiKey.value, domain.value, selectedCustomer.value);
      salesOrders.value = salesOrdersData;
      console.log('Sales orders data loaded successfully');
    };






    const fetchSelectedSalesOrder = async (selectedValue) => {
      console.log('fetchSelectedSalesOrder called with: ', selectedValue);
      if (!selectedValue) return;
      const url = `https://${domain.value}.weclapp.com/webapp/api/v1/salesOrder?id-eq="${selectedValue}"&properties=id,orderItems.id,orderItems.title,orderItems.tasks.id`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            "AuthenticationToken": apiKey.value
          }
        });
        const result = await response.json();
        if (response.ok) {
          if (result.result && result.result.length > 0) {
            const orderData = result.result[0]; // Access the first element of result
            orderItems.value = orderData.orderItems.map(item => ({
              id: item.id,
              title: item.title,
              tasks: item.tasks.map(task => task.id),
            }));
            console.log('Extracted task ids: ', orderItems.value);
          } else {
            console.log('No data found for the given id.');
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (e) {
        console.error("Error fetching selected sales order: ", e);
      }
    };

    const fetchTaskAndSubject = async (taskId, retries = 3) => {
      const url = `https://${domain.value}.weclapp.com/webapp/api/v1/task?id-eq=${taskId}&properties=id,subject`;
      try {
        const response = await axios.get(url, {
          headers: {
            "Accept": "application/json",
            "AuthenticationToken": apiKey.value
          }
        });
        const tasks = response.data.result;
        if (tasks.length > 0) {
          const taskData = tasks[0];
          currentTaskAndSubject.value.push({
            taskId: taskData.id,
            subject: taskData.subject,
          });
        } else {
          console.error('Keine Aufgaben gefunden.');
        }
      } catch (error) {
        if (retries > 0 && (error.message.includes("Network Error") || (error.response && error.response.status === 0))) {
          console.error('Netzwerkfehler erkannt, versuche erneut...');
          setTimeout(() => fetchTaskAndSubject(taskId, retries - 1), 1000);
        } else {
          console.error('Fehler beim Abrufen der Task- und Subject-Daten:', error);
        }
      }
    };



    const fetchUsers = async (retries = 3) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("AuthenticationToken", apiKey.value);
      myHeaders.append("Cookie", "_sid_=19");
      myHeaders.append("Access-Control-Request-Method", "GET");
      myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
      myHeaders.append("Origin", `https://${domain.value}.weclapp.com`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://${domain.value}.weclapp.com/webapp/api/v1/user`, requestOptions);
        if (!response.ok) throw new Error('Response not okay');
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        users.value = parsedResult.result;
        console.log('User-Daten erfolgreich geladen');
      } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
          console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
          setTimeout(() => fetchUsers(retries - 1), 1000);
        } else {
          console.error('Fehler beim Abrufen der Benutzerdaten:', error);
        }
      }
    };


    const postTimeRecord = async (item) => {
      const myHeaders = new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "AuthenticationToken": apiKey.value
      });

      const raw = JSON.stringify({
        "billable": true,
        "billableDurationSeconds": item.duration,
        "description": item.description,
        "durationSeconds": item.duration,
        "startDate": item.startDate,
        "taskId": selectedTask.value,
        "userId": selectedUser.value,
        "placeOfServiceId": item.placeOfServiceId
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://${domain.value}.weclapp.com/webapp/api/v1/timeRecord`, requestOptions);
        const result = await response.json();
        if (!response.ok && response.status === 400) {
          // add to issue
          if (result.messages) {
            const messages = result.messages.map(message => message.message);
            messages.forEach(message => {
              if (!issues.value.some(issue => issue === message)) {
                issues.value.push(message);
              }
            });
          } else if (result.error) {
            if (!issues.value.some(issue => issue === result.error)) {
              issues.value.push(result.error);
            }
          }
        }
        else if (response.status === 201) {
          postConfirmed.value = true;
          console.log('Time record posted successfully:', result);
        }
      } catch (error) {
        console.error('Error posting time record:', error);
      }
    };

    const postAllTimeRecords = async () => {
      console.log("button clicked");
      console.log(editedData.value);
      for (const item of editedData.value) {
        await postTimeRecord(item);
      }
    };

// Führen Sie den POST-Request für jede Zeile in der Excel-Datei aus
    editedData.value.forEach(item => {
      postTimeRecord(item);
    });


    const fetchData = async () => {
      fetchUsers(),
      loadCustomerData()
    };

    watch(selectedCustomer, async (newVal) => {
      if (newVal) {
        console.log(`Selected customer ID: ${newVal}`);
        selectedCustomer.value = newVal;
        console.log('Selected customer: ', selectedCustomer.value);
        await loadSalesOrdersData(apiKey.value, domain.value, selectedCustomer.value);
      }
    }, { immediate: false });


    watch(selectedUser, (newVal) => {
      if (newVal.id) {
        const user = users.value.find(user => user.id === newVal.id);
        selectedUser.email = user.email;
        console.log(`Selected user ID: ${selectedUser.id}, email: ${selectedUser.email}`);
      }
    });

    watch(selectedOrder, async (newVal) => {
      if (newVal) {
        selectedOrder.value = newVal;
        console.log(`Selected order ID: ${newVal}`);
        await fetchSelectedSalesOrder(newVal);
      }
    }, { immediate: false });


    watch(selectedOrderItem, (newVal) => {
      if (newVal) {
        const selectedItem = orderItems.value.find(item => item.id === newVal);
        if (selectedItem && selectedItem.tasks) {
          currentTasks.value = selectedItem.tasks;
          console.log('Tasks geladen: ', currentTasks.value);
          currentTaskAndSubject.value = []; // Zurücksetzen vor dem Hinzufügen neuer Daten
          selectedItem.tasks.forEach(taskId => {
            fetchTaskAndSubject(taskId);
          });
          console.log('Tasks und Subjects geladen: ', currentTaskAndSubject.value);
        } else {
          currentTasks.value = [];
          currentTaskAndSubject.value = []; // Keine Tasks vorhanden, zurücksetzen der Daten
        }
      }
    });

    watch(selectedTask, (newVal) => {
      if (newVal) {
        const selectedTask = tasks.value.find(task => task.id === newVal);
        console.log(`Selected task ID: ${selectedTask}`);
      }
    });

    watch(apiKey, (newApiKey) => {
      localStorage.setItem('apiKey', newApiKey);
    });

    watch(domain, (newDomain) => {
      localStorage.setItem('domain', newDomain);
    });

    // State für Eingabebestätigung
    const confirmInput = (field, value) => {
      if (field === 'apiKey') {
        apiKeyConfirmed.value = !!value.trim();
      } else if (field === 'domain') {
        domainConfirmed.value = !!value.trim();
      }
    };

    const toggleBlur = (field) => {
      if (field === 'apiKey') {
        apiKeyVisible.value = !apiKeyVisible.value;
      } else if (field === 'domain') {
        domainVisible.value = !domainVisible.value;
      }
    };

    return {
      file,
      apiKey,
      data,
      salesOrders,
      orderItems,
      tasks,
      currentTasks, // Stellen Sie sicher, dass currentTasks im Template verwendet wird
      selectedTask,
      users,
      selectedUser,
      selectedOrder,
      selectedOrderItem,
      domain,
      apiKeyConfirmed,
      domainConfirmed,
      apiKeyVisible,
      domainVisible,
      editedData,
      currentTaskAndSubject,
      issues,
      postConfirmed,
      hasDescription,
      customers,
      selectedCustomer,
      dataLoaded,
      fileUploaded,
      dataRead,
      handleFileUpload,
      confirmInput,
      toggleBlur,
      readData,
      fetchSalesOrders,
      fetchSelectedSalesOrder,
      fetchData,
      postTimeRecord,
      fetchUsers,
      postAllTimeRecords,
      fetchTaskAndSubject,
      loadCustomerData,
      loadSalesOrdersData
    };
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.container {
  max-width: 960px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

input, select, button {
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 2px solid #ddd; /* Subtle borders */
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
}

input[type="text"], select {
  background-color: #fff;
  color: #333;
}

input[type="text"]:focus, select:focus {
  border-color: #555; /* Focus effect */
  outline: none;
}

button {
  color: #fff;
  background-color: #ec6602; /* Bootstrap primary color */
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #FA8C47; /* Darker on hover */
}

button:active {
  background-color: #ec6602; /* Even darker on active */
}

input[type="file"] {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}

/* Adjusting Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

thead {
  background-color: #f7f7f7;
}

tbody tr {
  transition: background-color 0.3s;
}

tbody tr:nth-child(even) {
  background-color: #f0f0f0;
}

tbody tr:hover {
  background-color: #e8e8e8;
}

.file-input {
  position: relative;
  margin: 10px 0;
}

.file-input input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

.file-input label {
  display: block;
  background-color: #ec6602;
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  transition: background-color 0.3s;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;


}

.file-input label:hover {
  background-color: #FA8C47;
}

.collapsed-input {
  height: 30px; /* Reduzierte Höhe für einklappende Wirkung */
  transition: height 0.3s, padding 0.3s; /* Animation für Höhen- und Padding-Übergänge */
  padding: 5px; /* Reduziertes Padding */
  overflow: hidden; /* Verhindert Überlauf des Inhalts */
}

.blurred{
  transition: filter 0.5s ease; /* Add a transition to the filter property */
  filter: blur(3px); /* Erhöht die Unschärfe für den Text */
  user-select: none;
}

.error-dashboard {
  background-color: #f8d7da; /* Sanftes Rot als Hintergrundfarbe */
  border: 2px solid #f5c6cb; /* Zartere rote Umrandung */
  border-radius: 15px; /* Abgerundete Ecken */
  padding: 20px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Stärkerer Schatten für mehr Tiefe */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modernere Schriftart */
}

.finish-dashboard{
  background-color: #90EE90; /* Leichtes Grün als Hintergrundfarbe */
  border: 2px solid #32CD32; /* Dunkleres Grün als Rahmenfarbe */
  border-radius: 15px; /* Abgerundete Ecken */
  padding: 20px;
  max-width: 600px;
  margin: 20px auto;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Stärkerer Schatten für mehr Tiefe */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modernere Schriftart */
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>

