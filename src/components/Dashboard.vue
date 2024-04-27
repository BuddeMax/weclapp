<template>
  <div class="container">
    <h1>Weclapp Time Track</h1>

    <button @click="fetchData">Fetch Data</button>
    <div>
      <label for="apiKeyInput">API Key:</label>
      <input
          id="apiKeyInput"
          type="text"
          v-model="apiKey"
          :class="{'collapsed-input': apiKeyConfirmed, 'blurred': apiKeyConfirmed && !apiKeyVisible}"
          @input="confirmInput('apiKey', $event.target.value)"
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
          @input="confirmInput('domain', $event.target.value)"
          @click="domainVisible = true"
          @blur="domainVisible = false"
          class="domain-input"
      >
    </div>

    <div>
      <label for="salesOrderSelect">Select a Sales Order:</label>
      <select id="salesOrderSelect" v-model="selectedOrder">
        <option v-for="order in salesOrders" :key="order.id" :value="order.id">{{ order.commission }} (ID: {{ order.id }})</option>
      </select>

    </div>
    <div>
      <label for="orderItemSelect">Select an Order Item:</label>
      <select id="orderItemSelect" v-model="selectedOrderItem">
        <option v-for="item in orderItems" :key="item.id" :value="item.id">{{ item.title }} (ID: {{ item.id }})</option>
      </select>
    </div>
    <div>
      <label for="taskSelect">Select a Task:</label>
      <select id="taskSelect" v-model="selectedTask">
        <option v-for="task in currentTaskAndSubject" :key="task.taskId" :value="task.taskId">
          {{ task.subject }} (ID: {{ task.taskId }})
        </option>
      </select>
    </div>
    <div>
      <label for="userSelect">Select a User:</label>
      <select id="userSelect" v-model="selectedUser">
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.firstName }} {{ user.lastName }} ({{ user.email }})</option>
      </select>
    </div>
    <div class="file-input">
      <input type="file" id="file" @change="handleFileUpload" accept=".xlsx,.xls,.csv">
      <label for="file">Upload File</label>
    </div>
    <div>
      <button @click="readData">Read Data</button>
    </div>
    <div>
      <button @click="postAllTimeRecords">Post Time Record</button>
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
          <th>Beschreibung</th>
          <th>Dauer in Stunden</th>
          <th>Ort</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.timestamp }}</td>
          <td>{{ item.description }}</td>
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



export default {
  methods: {
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





    const handleFileUpload = event => {
      file.value = event.target.files[0];
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

        // Festlegen des Bereichs zum Ignorieren der ersten vier Zeilen und Starten bei der fünften Zeile
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        range.s.r = 4; // Start ab der fünften Zeile

        // Konvertieren der Daten zu JSON, wobei der modifizierte Bereich genutzt wird
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { range }).map(item => {
          // Überprüfen, ob das Zeitfeld und das Feld "Dauer in Stunden" nicht leer sind
          if (!isNaN(item.Zeit) && !isNaN(item['Dauer in Stunden'])) {
            return {
              date: convertExcelDateToJSDate(item.Datum),
              timestamp: convertExcelTimeToReadableTime(item.Zeit),
              description: item.Beschreibung,
              duration: convertExcelTimeToReadableTime(item['Dauer in Stunden']), // Umwandlung von Stunden in Sekunden
              placeOfService: item['Ort']
            };
          }
        }).filter(item => item !== undefined); // Entfernen von undefinierten Einträgen

        data.value = jsonData;
        console.log('Data read: ', data.value);
        convertData()
      };
      reader.readAsArrayBuffer(file.value);
    };

    function convertExcelDateToJSDate(excelDate) {
      // Excel-Datumszahlen beginnen am 1. Januar 1900. Der Tag 1 ist der 1. Januar 1900
      const date = new Date(Date.UTC(1899, 11, 31));

      // Hinzufügen der ganzzahligen Tage zum Startdatum
      const days = Math.floor(excelDate);
      date.setDate(date.getDate() + days);

      // Rückgabe des Datums im lokalen Format ohne Zeitkomponente
      return date.toLocaleDateString('de-DE');
    }

    function convertExcelTimeToReadableTime(excelTime) {


      // Berechnung der Stunden, Minuten und Sekunden aus dem seriellen Wert
      var fractional_day = excelTime - Math.floor(excelTime) + 0.0000001;
      var total_seconds = Math.floor(86400 * fractional_day);
      var seconds = total_seconds % 60;
      total_seconds -= seconds;
      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;

      // Rückgabe im Format HH:MM:SS
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }



    function convertDurationToUnixTimestamp(duration) {
      const [hours, minutes] = duration.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      // Umwandlung der Minuten in Sekunden
      const totalSeconds = totalMinutes * 60;
      return totalSeconds;
    }

    function excelDateToUnixTime(excelDate) {
      // Split the Excel date string into day, month, and year components
      const dateComponents = excelDate.split('.');

      // Parse day, month, and year from the components
      const day = parseInt(dateComponents[0], 10);
      const month = parseInt(dateComponents[1], 10);
      const year = parseInt(dateComponents[2], 10);

      // Create a JavaScript Date object from the parsed components
      const jsDate = new Date(year, month - 1, day); // Note: Month in JavaScript Date object is 0-indexed

      // Get the Unix time (in milliseconds) from the JavaScript Date object
      const unixTimeInMilliseconds = jsDate.getTime();

      return unixTimeInMilliseconds;
    }


    const convertData = () => {
      // Konvertieren der Daten
      const convertedData = data.value.map(item => ({
        startDate: excelDateToUnixTime(item.date) + convertDurationToUnixTimestamp(item.timestamp),
        duration: convertDurationToUnixTimestamp(item.duration),
        billableDuration: convertDurationToUnixTimestamp(item.duration),
        // wenn in der Zeile remote steht dann 6240, wenn Vor Ort beim Kunden dann 13360
        placeOfServiceId: item.placeOfService === 'Remote' ? 6240 : 13360,
        description: item.description,
        taskId: selectedTask.value,
        userId: selectedUser.value,
      }));

      // Speichern der konvertierten Daten in editedData
      editedData.value = convertedData;

      console.log('Converted data: ', editedData.value);
    };








    const fetchSalesOrders = async (retries = 3) => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("AuthenticationToken", apiKey.value);
      myHeaders.append("Access-Control-Request-Method", "GET");
      myHeaders.append("Access-Control-Request-Headers", "AuthenticationToken, Content-Type");
      myHeaders.append("Origin", `https://${domain.value}.weclapp.com`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://${domain.value}.weclapp.com/webapp/api/v1/salesOrder`, requestOptions);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        salesOrders.value = result.result.map(order => ({
          id: order.id,
          commission: order.commission
        }));
        console.log('Verkaufsaufträge erfolgreich geladen');
      } catch (error) {
        if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('Network Error') || (error.response && error.response.status === 0))) {
          console.error('Netzwerk- oder CORS-Fehler erkannt, versuche erneut...');
          setTimeout(() => fetchSalesOrders(retries - 1), 1000);
        } else {
          console.error('Fehler beim Abrufen der Verkaufsaufträge:', error);
        }
      }
    };



    const fetchSelectedSalesOrder = async (selectedValue) => {
      console.log('fetchSelectedSalesOrder called with: ', selectedValue);
      if (!selectedValue) return;
      const url = `https://${domain.value}.weclapp.com/webapp/api/v1/salesOrder/id/${selectedValue}`;
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
          orderItems.value = result.orderItems.map(item => ({
            id: item.id,
            title: item.title,
            tasks: item.tasks.map(task => task.id),
          }));
          console.log('Extracted task ids: ', orderItems.value);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (e) {
        console.error("Error fetching selected sales order: ", e);
      }
    };

    const fetchTaskAndSubject = async (taskId, retries = 3) => {
      const url = `https://${domain.value}.weclapp.com/webapp/api/v1/task/id/${taskId}`;
      try {
        const response = await axios.get(url, {
          headers: {
            "Accept": "application/json",
            "AuthenticationToken": apiKey.value
          }
        });
        const taskData = response.data;
        currentTaskAndSubject.value.push({
          taskId: taskData.id,
          subject: taskData.subject,
        });
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
        "userId": selectedUser.value
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


    const fetchData = () => {
      fetchSalesOrders();
      fetchUsers();
    };



    watch(selectedUser, (newVal) => {
      if (newVal.id) {
        const user = users.value.find(user => user.id === newVal.id);
        selectedUser.email = user.email;
        console.log(`Selected user ID: ${selectedUser.id}, email: ${selectedUser.email}`);
      }
    });

    watch(selectedOrder, async (newVal) => {
      if (newVal) {
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


/* When a file is selected, use JavaScript to change the content of the pseudo-element or the text of the separate element */




@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  h1 {
    font-size: 2rem;
  }


}
</style>

