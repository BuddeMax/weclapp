<template>
  <div class="container">
    <h1>Weclapp Timetrack</h1>

    <button @click="fetchData">Fetch Data</button>
    <div class="api-input">
      <label for="apiKeyInput">API Key:</label>
      <input id="apiKeyInput" type="text" v-model="apiKey" class="input">
    </div>
    <div class="domain-input">
      <label for="domainInput">Domain:</label>
      <input id="domainInput" type="text" v-model="domain" class="input">
    </div>

    <div>
      <label for="salesOrderSelect">Select a Sales Order:</label>
      <select id="salesOrderSelect" v-model="selectedOrder" @change="fetchSelectedSalesOrder($event.target.value)">
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
        <option v-for="task in currentTasks" :key="task" :value="task">{{ task }}</option>
      </select>
    </div>
    <div>
      <label for="userSelect">Select a User:</label>
      <select id="userSelect" v-model="selectedUser">
        <option v-for="user in users" :key="user.id" :value="user.id">{{ user.firstName }} {{ user.lastName }} ({{ user.email }})</option>
      </select>
    </div>
    <div class="file-upload" style="flex-direction: column; justify-content: center; align-items: center;">
      <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileUpload">
      <button @click="readData">Read</button>
    </div>
    <div>
      <button @click="postAllTimeRecords">Post Time Record</button>
    </div>
    <div>
      <h2>Data:</h2>
      <table>
        <thead>
        <tr>
          <th>billable</th>
          <th>billableDuration</th>
          <th>description</th>
          <th>duration</th>
          <th>startDate</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ item.billable }}</td>
          <td>{{ item.billableDuration }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ item.startDate }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {ref, watch} from 'vue';
import * as XLSX from 'xlsx';
import axios, {post} from "axios";


export default {
  name: 'ExcelReader',
  methods: {
    async post(url, data) {
      try {
        const response = await axios.post(url, data);
        return response.data;
      } catch (error) {
        console.error('Error with post method:', error);
      }
    }
  },
  setup() {
    const file = ref(null);
    const data = ref([]);
    const salesOrders = ref([]);
    const selectedOrder = ref(null);
    const orderItems = ref([]);
    const selectedOrderItem = ref(null);
    const tasks = ref([]);
    const currentTasks = ref([]);  // Hält die Tasks, die zum ausgewählten Order Item gehören
    const selectedTask = ref(null);
    const users = ref([]);
    const selectedUser = ref(null);
    const message = ref('');
    const apiKey = ref(localStorage.getItem('apiKey') || '');
    const domain = ref(localStorage.getItem('domain') || '');



    const handleFileUpload = event => {
      file.value = event.target.files[0];
    };

    const convertExcelDateToJSDate = (excelSerial) => {
      return new Date(Math.round((excelSerial - 25569) * 86400 * 1000));
    };

    const convertToUnixTimestamp = (dateInput) => {
      if (typeof dateInput === 'number') {
        return convertExcelDateToJSDate(dateInput).getTime() / 1000;
      }
      const [day, month, yearTime] = dateInput.split('.');
      const [year, time] = yearTime.split(' ');
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
      return new Date(formattedDate).getTime() / 1000;
    };

    const readData = () => {
      if (!file.value) {
        message.value = 'Keine Datei ausgewählt.';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const wb = XLSX.read(ab, {type:'array'});
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet).map(item => ({
          ...item,
          billableDuration: item.billableDuration * 3600,
          duration: item.duration * 3600,
          startDate: item.startDate ? convertToUnixTimestamp(item.startDate) * 1000 : null
        }));
        data.value = jsonData;
      };
      reader.readAsArrayBuffer(file.value);
    };

    const fetchSalesOrders = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("AuthenticationToken", apiKey.value);

      const raw = "";

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://${domain.value}.weclapp.com/webapp/api/v1/salesOrder`, requestOptions);
        const result = await response.json();
        if (response.ok) {
          salesOrders.value = result.result.map(order => ({
            id: order.id,
            commission: order.commission
          }));
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (e) {
        console.error("Error fetching sales orders: ", e);
      }
    };

    const fetchSelectedSalesOrder = async (selectedValue) => {
      console.log('fetchSelectedSalesOrder called with: ', selectedValue);
      if (!selectedValue) return;
      const url = `https://bbmjboksjsbyiqe.weclapp.com/webapp/api/v1/salesOrder/id/${selectedValue}`;
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
          data.value = [result];
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (e) {
        console.error("Error fetching selected sales order: ", e);
      }
    };

    const fetchUsers = async () => {

      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("AuthenticationToken", apiKey.value);
      myHeaders.append("Cookie", "_sid_=19");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch("https://bbmjboksjsbyiqe.weclapp.com/webapp/api/v1/user", requestOptions)
          .then((response) => response.text())
          //speichere die antowrt in result
          .then((result) => {
            //parse die antwort in ein json objekt
            const parsedResult = JSON.parse(result);
            //speichere das result in users
            users.value = parsedResult.result;
          })
          .then((result) => console.log(result))
          .catch((error) => console.error(error));


    };

    const postTimeRecord = async (item) => {
      const myHeaders = new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "AuthenticationToken": apiKey.value
      });

      const raw = JSON.stringify({
        "billable": item.billable,
        "billableDurationSeconds": item.billableDuration,
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
        const response = await fetch("https://bbmjboksjsbyiqe.weclapp.com/webapp/api/v1/timeRecord", requestOptions);
        const result = await response.text();
        console.log(result);
      } catch (error) {
        console.error('Error posting time record:', error);
      }
    };

    const postAllTimeRecords = async () => {
      for (const item of data.value) {
        await postTimeRecord(item);
      }
    };

// Führen Sie den POST-Request für jede Zeile in der Excel-Datei aus
    data.value.forEach(item => {
      postTimeRecord(item);
    });

    const fetchData = () => {
      fetchSalesOrders();
      fetchUsers();
    };

    const fetchTasksForSelectedItem = async (selectedItemId) => {
      console.log('fetchTasksForSelectedItem called with: ', orderItems);
    };

    watch(selectedUser, (newVal) => {
      if (newVal) {
        const user = users.value.find(user => user.id === newVal);
        console.log(`Selected user ID: ${user.id}, email: ${user.email}`);
      }
    });

    watch(selectedOrder, (newVal) => {
      if (newVal) {
        const selectedOrder = salesOrders.value.find(order => order.id === newVal);
        console.log(`Selected order ID: ${selectedOrder.id}, commission: ${selectedOrder.commission}`);
      }
      console.log('Selected order: ', newVal);
    });

    watch(selectedOrderItem, (newVal) => {
      if (newVal) {
        const selectedItem = orderItems.value.find(item => item.id === newVal);
        if (selectedItem && selectedItem.tasks) {
          currentTasks.value = selectedItem.tasks;
        } else {
          currentTasks.value = [];
        }
      }
    });

    watch(selectedTask, (newVal) => {
      if (newVal) {
        const selectedTask = tasks.value.find(task => task.id === newVal);
        console.log(`Selected task ID: ${newVal}`);
      }
    });

    watch(apiKey, (newApiKey) => {
      localStorage.setItem('apiKey', newApiKey);
    });

    watch(domain, (newDomain) => {
      localStorage.setItem('domain', newDomain);
    });

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
      handleFileUpload,
      readData,
      fetchSalesOrders,
      fetchSelectedSalesOrder,
      fetchData,
      postTimeRecord,
      fetchUsers,
      postAllTimeRecords
    };
  }
}
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: 'Nunito', sans-serif;
  color: #000000; /* Schwarz für Text */
  background-color: #ffffff; /* Weiß für Hintergrund */
}

.file-upload, .dropdown {
  margin: 20px auto;
  display: block;
  width: 250px;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #000000; /* Schwarz für Text */
}

.api-input {
  margin: 10px auto;
  display: block;
  width: calc(100% - 22px);
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #000000; /* Schwarz für Text */
}

.domain-input {
  margin: 10px auto;
  display: block;
  width: calc(100% - 22px);
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #000000; /* Schwarz für Text */
}

h1, h2 {
  color: #000000; /* Schwarz für Überschriften */
  font-weight: 700;
}

button {
  cursor: pointer;
  background: #ec6602; /* Orange für Buttons */
  color: #ffffff; /* Weiß für Button-Text */
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  margin: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 1rem;
}

button:hover {
  background: #b35402; /* Dunkleres Orange für Button-Hover */
  box-shadow: 0 6px 8px rgba(0,0,0,0.15);
}

input[type="file"], input[type="text"], select {
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #000000; /* Schwarz für Input-Border */
  border-radius: 8px;
  width: calc(100% - 22px);
  transition: border-color 0.3s;
  color: #000000; /* Schwarz für Text */
  background-color: #ffffff; /* Weiß für Hintergrund */
}

input[type="file"]:hover, input[type="text"]:hover, select:hover {
  border-color: #ec6602; /* Orange für Input-Hover */
}

.data-table {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
}

thead {
  background-color: #F5F5F5;
}

tbody tr {
  transition: background-color 0.3s;
}

tbody tr:hover {
  background-color: #EEEEEE; /* Hover effect for rows */
}

tbody tr:nth-child(even) {
  background-color: #FAFAFA; /* Zebra striping */
}



@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .file-upload, .dropdown {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    margin-top: 10px;
  }

  input[type="file"], input[type="text"], select {
    width: 100%;
  }
}
</style>