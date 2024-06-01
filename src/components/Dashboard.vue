<template>
  <div class="container">
    <h1>Weclapp Time Track</h1>
    <button @click="fetchData">
      <span v-if="dataLoaded">&#10004; Daten geladen</span>
      <span v-else>Daten laden</span>
    </button>
    <div class="input-container">
      <label for="apiKeyInput">API Key:</label>
      <input
          id="apiKeyInput"
          type="text"
          v-model="apiKey"
          :class="{'collapsed-input': apiKeyConfirmed, 'blurred': apiKeyConfirmed && !apiKeyVisible, 'invalid-input': apiKeyInvalid, 'api-input': true}"
          @input="validateApiKey"
          @click="apiKeyVisible = true"
          @blur="apiKeyVisible = false"
      >
      <p v-if="apiKeyInvalid" class="error-message">Ungültiger API-Schlüssel</p>
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
        <option disabled value="">Bitte auswählen</option>
        <option v-for="customer in customers.sort((a, b) => Number(a.customerNumber) - Number(b.customerNumber))" :key="customer.id" :value="customer.id">
          {{ customer.customerNumber }} - {{ customer.company }}
        </option>
      </select>
    </div>
    <div>
      <label for="salesOrderSelect">Wähle einen Auftrag:</label>
      <select id="salesOrderSelect" v-model="selectedOrder">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="order in salesOrders.sort((a, b) => a.orderNumber.localeCompare(b.orderNumber))" :key="order.id" :value="order.id">
           {{ order.orderNumber }} - {{ order.commission }}
        </option>
      </select>
    </div>
    <div>
      <label for="orderItemSelect">Wähle ein Service:</label>
      <select id="orderItemSelect" v-model="selectedOrderItem">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="item in orderItems" :key="item.id" :value="item.id">{{ item.title }} - Offene Zeiten:
          {{ item.remainingHours }} ({{item.taskStatus}})
        </option>
      </select>
    </div>
    <div>
      <p v-if="taskCompletionStatus" class="error-message">Keine Stunden übrig oder abgeschlossen</p>
    </div>
    <div v-if="!taskCompletionStatus">
      <label for="taskSelect">Wähle eine Aufgabe:</label>
      <select id="taskSelect" v-model="selectedTask">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="task in currentTaskAndSubject" :key="task.taskId" :value="task.taskId">
          {{ task.subject }} (ID: {{ task.taskId }})
        </option>
      </select>
    </div>
    <div>
      <label for="userSelect">Wähle einen User:</label>
      <select id="userSelect" v-model="selectedUser">
        <option disabled value="">Bitte auswählen</option>
        <option v-for="user in users" :key="user?.id" :value="user?.id">
          {{ user?.firstName }} {{ user?.lastName }} ({{ user?.email }})
        </option>
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
    <div>
      <h2>Daten:</h2>
      <table>
        <thead>
        <tr>
          <th>Startdatum</th>
          <th>Zeit</th>
          <th v-if="hasDescription">Beschreibung</th>
          <th>Dauer in Stunden</th>
          <th>Ort</th>
          <th>Status</th> <!-- Neue Spalte für den Status -->
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in data.value" :key="`${item.id}-${item.message}`">
          <td>{{ item.date }}</td>
          <td>{{ item.timestamp }}</td>
          <td v-if="hasDescription">{{ item.description || ' ' }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ item.placeOfService }}</td>
          <td :class="{ 'success': item.message === 'Erfolgreich', 'error': item.message && item.message !== 'Erfolgreich' }">
            {{ item.message || 'Nicht verarbeitet' }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div>
      <h3>Gesamte Stunden: {{ totalHours }}</h3>
    </div>
  </div>
</template>

<script>
import {reactive, ref, watch, nextTick} from 'vue';
import * as XLSX from 'xlsx';
import axios, {post} from "axios";
import async from "async";
import {store} from '../store/store.js';
import {convertExcelDateToJSDate} from '../service/utils.js';
import {convertExcelTimeToReadableTime} from '../service/utils.js';
import {convertDurationToUnixTimestamp} from '../service/utils.js';
import {excelDateToUnixTime} from '../service/utils.js';
import {getUnixTimestamp} from '../service/utils.js';
import {checkTaskCompletion, fetchCustomer, fetchUsers} from '../service/api.js';
import {fetchSalesOrders} from '../service/api.js';
import {fetchSelectedSalesOrder} from '../service/api.js';
import {fetchTaskAndSubject} from '../service/api.js';
import {postTimeRecord} from '../service/api.js';
import {fetchProjectUsers} from '../service/api.js';


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
    }
  },
  setup() {
    const file = ref(null);
    const data = reactive([]);
    const reactiveData = reactive([]); // Verwenden Sie reactive anstelle von ref
    const editedData = reactive([]); // Verwenden Sie reactive anstelle von ref
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
    const apiKeyInvalid = ref(false); // Initialisierung von apiKeyInvalid
    const taskCompletionStatus = ref(false);
    const taskFinishedStatus = ref(false);
    const totalHours = ref(0);



    const validateApiKey = () => {
      const apiKeyPattern = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
      apiKeyInvalid.value = !apiKeyPattern.test(apiKey.value);
    };

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
        const wb = XLSX.read(ab, {type: 'array'});
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        range.s.r = 4;

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {range}).map(item => {
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
        reactiveData.value = jsonData;
        console.log('Data read: ', data.value);
        convertData();
        sumHours();
      };
      reader.readAsArrayBuffer(file.value);
    };

    const sumHours = () => {
      totalHours.value = data.value.reduce((acc, item) => {
        const [hours, minutes, seconds] = item.duration.split(':').map(Number);
        const totalMinutes = (hours * 60) + minutes + (seconds / 60);
        return acc + totalMinutes;
      }, 0);

      const totalHoursFloat = totalHours.value / 60;
      const totalHoursInt = Math.floor(totalHoursFloat);
      const remainingMinutes = Math.round((totalHoursFloat - totalHoursInt) * 60);

      totalHours.value = `${totalHoursInt}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes} Stunden`;
    };


    const convertData = () => {

      const convertedData = data.value.map(item => ({
        startDate: getUnixTimestamp(item.date, item.timestamp),
        duration: convertDurationToUnixTimestamp(item.duration),
        billableDuration: convertDurationToUnixTimestamp(item.duration),
        placeOfServiceId: item.placeOfService ? Number(item.placeOfService.split(':')[1].trim()) : null,
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

    const fetchData = async () => {
          loadCustomerData()
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

    const loadUsers = async () => {
      let usersData;
      do {
        usersData = await fetchUsers(apiKey.value, domain.value);
        if (!usersData || usersData.length === 0) {
          console.log('Keine Benutzerdaten gefunden, versuche erneut...');
        } else {
          console.log('Benutzerdaten erfolgreich geladen');
        }
      } while (!usersData || usersData.length === 0);
      users.value = usersData;
    };

    const loadSalesOrdersData = async () => {
      const salesOrdersData = await fetchSalesOrders(apiKey.value, domain.value, selectedCustomer.value);
      salesOrders.value = salesOrdersData;
      console.log('Sales orders data loaded successfully');
    };

    const loadSelectedSalesOrder = async () => {
      const selectedSalesOrderData = await fetchSelectedSalesOrder(apiKey.value, domain.value, selectedOrder.value);
      if (!selectedSalesOrderData) {
        console.error('selectedSalesOrderData is null or undefined');
        return;
      }
      if (!Array.isArray(selectedSalesOrderData.orderItems)) {
        console.error('Expected selectedSalesOrderData.orderItems to be an array');
        return;
      }
      orderItems.value = [];

      for (const item of selectedSalesOrderData.orderItems) {
        let allTasksCompleted = true;
        let totalRemainingHours = 0;
        let totalPlannedEffortHours = 0;

        for (const taskId of item.tasks) {
          const taskCompletionResult = await checkTaskCompletionWrapper(taskId);
          if (taskCompletionResult) {
            totalRemainingHours += taskCompletionResult.remainingHours;
            totalPlannedEffortHours += taskCompletionResult.plannedEffortHours;
            if (!taskCompletionResult.completed) {
              allTasksCompleted = false;
            }
          } else {
            allTasksCompleted = false;
          }
        }

        if (!allTasksCompleted || totalRemainingHours > 0) {
          item.remainingHours = totalRemainingHours;
          item.plannedEffortHours = totalPlannedEffortHours;
          item.taskStatus = allTasksCompleted ? 'COMPLETED' : 'IN_PROGRESS';
          orderItems.value.push(item);
        }
      }

      console.log('Order items data loaded successfully');
    };




    const postAllTimeRecords = async () => {
      console.log("Beginne mit dem Posten aller Zeiteinträge");

      // Recheck remaining hours before posting
      await recheckRemainingHours();

      if (taskCompletionStatus.value) {
        console.error('No remaining hours to post time records.');
        return;
      }

      for (let i = 0; i < data.value.length; i++) {
        const item = data.value[i];
        try {
          const result = await postTimeRecord({
            startDate: getUnixTimestamp(item.date, item.timestamp),
            duration: convertDurationToUnixTimestamp(item.duration),
            billableDuration: convertDurationToUnixTimestamp(item.duration),
            placeOfServiceId: item.placeOfService ? Number(item.placeOfService.split(':')[1].trim()) : null,
            description: item.description,
            taskId: selectedTask.value,
            userId: selectedUser.value,
          }, apiKey.value, domain.value);

          if (result.success) {
            console.log('Time record posted successfully:', result.messages);
            data.value[i].message = 'Erfolgreich';
            console.log('Data:', data.value[i]);
            await nextTick();
          } else {
            console.error('Error posting time record:', result.messages);
            data.value[i].message = 'Fehler: ' + result.messages.join(', ');
          }
        } catch (error) {
          console.error('Exception when posting time record:', error);
          data.value[i].message = 'Ausnahme: ' + error.message;
        }
        await nextTick();
      }
      // Stellt sicher, dass die Ansicht aktualisiert wird
    };



    if (Array.isArray(editedData.value)) {
      editedData.value.forEach(item => {
        postTimeRecord(item);
      });
    }

    const checkTaskCompletionWrapper = async (taskId) => {
      try {
        const result = await checkTaskCompletion(apiKey.value, domain.value, taskId);
        if (result) {
          const { remainingHours, plannedEffortHours, completed } = result;
          return { remainingHours, plannedEffortHours, completed };
        }
      } catch (error) {
        console.error('Error checking task completion:', error);
      }
      return null;
    };

    watch(selectedCustomer, async (newVal) => {
      if (newVal) {
        console.log(`Selected customer ID: ${newVal}`);
        selectedCustomer.value = newVal;
        console.log('Selected customer: ', selectedCustomer.value);
        await loadSalesOrdersData(apiKey.value, domain.value, selectedCustomer.value);
      }
    }, {immediate: false});


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
        const selectedSalesOrderData = await fetchSelectedSalesOrder(apiKey.value, domain.value, newVal);
        if (selectedSalesOrderData?.projectModeActive && selectedSalesOrderData.projectMembers.length > 0) {
          const projectMembers = selectedSalesOrderData.projectMembers;
          users.value = await Promise.all(projectMembers.map(async (member) => {
            return fetchProjectUsers(apiKey.value, domain.value, member.userId);
          }));
        } else {
          await loadUsers();
        }
        await loadSelectedSalesOrder();
      }
    }, {immediate: false});




    watch(selectedOrderItem, async (newVal) => {
      if (newVal) {
        const selectedItem = orderItems.value.find(item => item.id === newVal);
        if (selectedItem && selectedItem.tasks) {
          currentTasks.value = selectedItem.tasks;
          console.log('Tasks geladen: ', currentTasks.value);
          currentTaskAndSubject.value = [];
          let totalRemainingHours = 0; // Track total remaining hours for the selected order item

          for (const task of selectedItem.tasks) {
            const taskId = typeof task === 'object' && task.id ? task.id : task; // Korrekte Extraktion der Task-ID
            const tasks = await fetchTaskAndSubject(apiKey.value, domain.value, taskId);
            if (tasks && tasks.length > 0) {
              const taskData = tasks[0];
              console.log('Task data:', taskData);
              const taskCompletionResult = await checkTaskCompletionWrapper(taskId);
              if (taskCompletionResult && !taskCompletionResult.completed) {
                totalRemainingHours += taskCompletionResult.remainingHours; // Update total remaining hours
                currentTaskAndSubject.value.push({
                  taskId: taskData.id,
                  subject: taskData.subject,
                  remainingHours: taskCompletionResult.remainingHours,
                  plannedEffortHours: taskCompletionResult.plannedEffortHours,
                  completed: taskCompletionResult.completed
                });
              }
            }
          }

          if (totalRemainingHours > 0) {
            taskCompletionStatus.value = false; // Enough hours left
          } else {
            taskCompletionStatus.value = true; // No hours left, show error message
          }
        } else {
          currentTasks.value = [];
          currentTaskAndSubject.value = [];
        }
      }
    });

    const recheckRemainingHours = async () => {
      if (selectedOrderItem.value) {
        const selectedItem = orderItems.value.find(item => item.id === selectedOrderItem.value);
        if (selectedItem && selectedItem.tasks) {
          let totalRemainingHours = 0;
          for (const task of selectedItem.tasks) {
            const taskId = typeof task === 'object' && task.id ? task.id : task;
            const taskCompletionResult = await checkTaskCompletionWrapper(taskId);
            if (taskCompletionResult && !taskCompletionResult.completed) {
              totalRemainingHours += taskCompletionResult.remainingHours;
            }
          }
          taskCompletionStatus.value = totalRemainingHours <= 0; // Update completion status based on remaining hours
        }
      }
    };

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
      currentTasks,
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
      apiKeyInvalid,
      taskCompletionStatus,
      totalHours,
      taskFinishedStatus,
      sumHours,
      postAllTimeRecords,
      checkTaskCompletionWrapper,
      validateApiKey,
      handleFileUpload,
      confirmInput,
      toggleBlur,
      readData,
      fetchSalesOrders,
      fetchSelectedSalesOrder,
      fetchData,
      postTimeRecord,
      fetchUsers,
      fetchTaskAndSubject,
      loadCustomerData,
      loadSalesOrdersData,
      loadSelectedSalesOrder,
      fetchProjectUsers
    };
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  box-sizing: border-box;
}

p {
  text-align: center; /* Zentriert den Text innerhalb von Paragraph-Elementen */
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
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
  background-color: #ffffff;
}

tbody tr:nth-child(even) {
  background-color: #fafafa;
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

.blurred {
  transition: filter 0.5s ease; /* Add a transition to the filter property */
  filter: blur(3px); /* Erhöht die Unschärfe für den Text */
  user-select: none;
}

.success {
  background-color: #abff81 !important;
}

.error {
  background-color: #ff8080 !important;
}


.error-message {
  color: #e74c3c; /* Rote Farbe für Fehler */
  background-color: #f2dede; /* Hellroter Hintergrund für bessere Sichtbarkeit */
  border: 1px solid #e74c3c; /* Passender Rand zur Textfarbe */
  padding: 10px; /* Ausreichend Padding für den Inhalt */
  border-radius: 5px; /* Abgerundete Ecken für ein modernes Aussehen */
  font-size: 0.9rem; /* Leicht kleinere Schriftgröße */
  animation: fadeIn 0.5s ease-in-out; /* Weiche Einblendanimation */
  text-align: center; /* Zentrierter Text für alle Inhalte in .error-message */
}

.error-message p {
  text-align: center; /* Zentriert den Text nur in <p>-Tags innerhalb von .error-message */
}

/* Stil für das Eingabefeld, wenn es als ungültig markiert ist */
input.invalid-input {
  margin-bottom: 10px;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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