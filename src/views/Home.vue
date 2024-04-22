<template>
  <div class="container">
    <h1>Weclapp Timetrack</h1>

    <button @click="fetchData">Fetch Data</button>
    <div>
      <label for="apiKeyInput">API Key:</label>
      <input id="apiKeyInput" type="text" v-model="apiKey" class="api-input">
    </div>
    <div >
      <label for="domainInput">Domain:</label>
      <input id="domainInput" type="text" v-model="domain" class="domain-input">
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
  methods: {
    async post(url, data) {
      try {
        const response = await axios.post(url, data);
        return response.data;
      } catch (error) {
        console.error('Error with post method:', error);
      }
    },
    handleFileUpload(event) {
      const fileNameLabel = document.getElementById('file-name');
      const files = event.target.files;
      if (files.length > 0) {
        fileNameLabel.textContent = files[0].name;
      } else {
        fileNameLabel.textContent = 'No file chosen...';
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
  background-color: #007BFF; /* Bootstrap primary color */
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3; /* Darker on hover */
}

button:active {
  background-color: #003d82; /* Even darker on active */
}

/* Styling file input */
.file-input-container {
  margin: 20px 0;
  padding: 15px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  text-align: center;
  transition: border-color 0.3s;
}

.file-input-container:hover {
  border-color: #007BFF; /* Highlight effect on hover */
}

input[type="file"] {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}

.file-input-label {
  display: inline-block;
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.file-input-label:hover {
  background-color: #0056b3; /* Darker on hover */
}

.file-input-label:active {
  background-color: #003d82; /* Even darker on active */
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
  background-color: #007BFF;
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
  background-color: #0056b3;
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
