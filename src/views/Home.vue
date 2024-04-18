<template>
  <div class="container">
    <h1>Input</h1>
    <div class="file-upload">
      <input type="file" accept=".xlsx,.xls,.csv" @change="handleFileUpload">
      <input type="text" v-model="apiKey" placeholder="Enter API Key">
      <button @click="readData">Read</button>
      <button @click="fetchSalesOrders">Fetch Data</button>
    </div>
    <div v-if="salesOrders.length" class="dropdown">
      <label for="salesOrderSelect">Select a Sales Order:</label>
      <select id="salesOrderSelect">
        <option v-for="order in salesOrders" :key="order.id" :value="order.id">{{ order.commission }} (ID: {{ order.id }})</option>
      </select>
    </div>
    <div v-if="data.length" class="data-table">
      <h2>Data:</h2>
      <table>
        <thead>
        <tr>
          <th>billable</th>
          <th>billableDuration</th>
          <th>billableInvoiceStatus</th>
          <th>description</th>
          <th>duration</th>
          <th>performanceRecordedStatus</th>
          <th>startDate</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ item.billable }}</td>
          <td>{{ item.billableDuration }}</td>
          <td>{{ item.billableInvoiceStatus }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.duration }}</td>
          <td>{{ item.performanceRecordedStatus }}</td>
          <td>{{ item.startDate }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import * as XLSX from 'xlsx';

export default {
  name: 'ExcelReader',
  setup() {
    const file = ref(null);
    const apiKey = ref('');
    const data = ref([]);
    const salesOrders = ref([]);

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
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const wb = XLSX.read(ab, {type:'array'});
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData = jsonData.map(item => {
          return {
            ...item,
            billableDuration: item.billableDuration * 3600, // convert hours to seconds
            duration: item.duration * 3600, // convert hours to seconds
            startDate: item.startDate ? convertToUnixTimestamp(item.startDate) * 1000 : null
          };
        });

        data.value = jsonData;
      };
      reader.readAsArrayBuffer(file.value);
    };

    const fetchSalesOrders = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("AuthenticationToken", "ffa13225-c346-47c5-bdc7-58233064e6f9	");
      myHeaders.append("Cookie", "_sid_=19");

      const raw = "";

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch("https://bbmjboksjsbyiqe.weclapp.com/webapp/api/v1/salesOrder", requestOptions);
        const result = await response.json(); // Assuming the API returns JSON
        salesOrders.value = result.entities?.map(({ id, commission }) => ({
          id,
          commission
        })) || []; // Use optional chaining and provide a default empty array
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return {
      file,
      apiKey,
      data,
      salesOrders,
      handleFileUpload,
      readData,
      fetchSalesOrders
    }
  }
}
</script>


<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
.file-upload, .dropdown {
  margin-bottom: 20px;
}
h1, h2 {
  color: #333;
}
button {
  cursor: pointer;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #3f51b5;
}
input[type="file"], input[type="text"], select {
  margin-bottom: 10px;
}
.data-table {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
thead {
  background-color: #e8eaf6;
}
tbody tr:nth-child(even) {
  background-color: #f6f6f6;
}
</style>