<template>
  <CheckInInput ref="checkInInputRef" />
  <CheckInForm v-if="isFormOpen" @checkInAdded="fetchData"></CheckInForm>
  <h1 class="text-center">Check-In List</h1>
  <div v-for="(item, index) in mergedCheckIns" :key="index">
    <CheckInCard v-if="item.type === 'daily'" :checkIn="item.data" :showHeader="index === 0" />
    <WeeklyCheckInCard v-else-if="item.type === 'weekly' && $store.state.weeklyCheckIn" :weeklyCheckIn="item.data" :showHeader="index === 0" />
  </div>
</template>


<script>
import CheckInCard from '../components/CheckInCard.vue';
import CheckInInput from '../components/CheckInInput.vue';
import WeeklyCheckInCard from "@/components/WeeklyCheckInCard.vue";
import CheckInForm from "@/components/CheckInForm.vue";
import { store } from "@/store/store";
import { watch } from 'vue';

export default {
  name: 'About',
  components: {
    WeeklyCheckInCard,
    CheckInCard,
    CheckInInput,
    CheckInForm
  },
  data() {
    return {
      isFormOpen: true,
      buttonStatus: false,
      inputValue: '',
      mergedCheckIns: [],
      checkIns: [],
      weeklyCheckIns: [],
      currentWeek: 1,
      pageSize: 7,
      userId: '',
      userEmail: this.$store.state.userEmail,
      token: this.$store.state.token.access_token
    }
  },
  created() {
    watch(() => store.state.checkInInput, async (newValue) => {
      if (newValue === true) {
        await this.fetchCheckIns();
        await this.fetchWeeklyCheckIns();
        this.mergeCheckIns();
      }
    }, { immediate: true });
  },
  watch: {
    '$store.state.startDate': function() {
      this.fetchData()
    },
    '$store.state.endDate': function() {
      this.fetchData()
    },
  },
  methods: {
    compareDates(a, b) {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      // a muss gleich b sein
      return 0;
    },
    compareWeeklyDates(a, b) {
      const toDateA = Date.parse(a.toDate);
      const toDateB = Date.parse(b.toDate);
      const fromDateA = Date.parse(a.fromDate);
      const fromDateB = Date.parse(b.fromDate);

      if (toDateA < toDateB) {
        return -1;
      }
      if (toDateA > toDateB) {
        return 1;
      }
      // Wenn toDate gleich ist, vergleichen wir fromDate
      if (fromDateA < fromDateB) {
        return -1;
      }
      if (fromDateA > fromDateB) {
        return 1;
      }
      // a muss gleich b sein
      return 0;
    },
    async fetchData() {
      try {
        await this.fetchCheckIns();
        await this.fetchWeeklyCheckIns();
        this.mergeCheckIns();
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    },
    async fetchCheckIns() {
      return new Promise((resolve, reject) => {
      // Header für die Authentifizierung vorbereiten
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // Stellen Sie sicher, dass Sie das tatsächliche Token aus dem Vuex Store verwenden
      const token = this.$store.state.token.access_token; // Angenommen, Ihr Token wird hier gespeichert
      myHeaders.append("Authorization", `Bearer ${token}`);

      // Request-Optionen vorbereiten
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      // Fetch-Anfrage mit den vorbereiteten Optionen durchführen
        fetch(`https://gainguru.onrender.com/api/user/${this.$store.state.userId}/checkIn/${this.$store.state.startDate}/${this.$store.state.endDate}`, requestOptions)
            .then(response => {
              if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
              }
              return response.json();
            })
            .then(data => {
              this.checkIns = data;
              this.checkIns.sort(this.compareDates); // Sort the Check-Ins
              resolve();
            })
            .catch(error => {
              console.error('Fehler beim Abrufen der Check-Ins:', error);
              reject(error);
            });
      });
    },
    async fetchWeeklyCheckIns() {
      // Header für die Authentifizierung vorbereiten
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // Stellen Sie sicher, dass Sie das tatsächliche Token aus dem Vuex Store verwenden
      const token = this.$store.state.token.access_token; // Angenommen, Ihr Token wird hier gespeichert
      myHeaders.append("Authorization", `Bearer ${token}`);

      // Request-Optionen vorbereiten
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      // Erstellen Sie ein neues Datum, das 6 Tage vor dem Startdatum liegt
      const startDate = new Date(this.$store.state.startDate);
      startDate.setDate(startDate.getDate() - 6);
      const formattedStartDate = startDate.toISOString().split('T')[0];

      // Überprüfen Sie, ob es Check-Ins gibt und setzen Sie das entsprechende Startdatum
      const startDateToUse = this.checkIns.length > 0 ? formattedStartDate : this.$store.state.startDate;

      // Fetch-Anfrage mit den vorbereiteten Optionen durchführen
      fetch(`https://gainguru.onrender.com/api/user/${this.$store.state.userId}/weeklyCheckIn/${startDateToUse}/${this.$store.state.endDate}`, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
          })
          .then(data => {
            this.weeklyCheckIns = data;
            this.weeklyCheckIns.sort(this.compareWeeklyDates); // Sort the Weekly Check-Ins
            // After fetching and sorting weekly check-ins, attempt to merge
            if (this.checkIns.length > 0) {
              this.mergeCheckIns();
            }
          })
          .catch(error => console.error('Fehler beim Abrufen der Check-Ins:', error));
    },
    mergeCheckIns() {
      const merged = [];
      let weeklyIndex = 0;

      // Sort both lists before merging
      this.checkIns.sort(this.compareDates);
      this.weeklyCheckIns.sort(this.compareWeeklyDates);

      // Iterate over daily check-ins and merge
      for (const checkIn of this.checkIns) {
        // Find the next weekly check-in that comes after the current daily check-in
        while (weeklyIndex < this.weeklyCheckIns.length && new Date(this.weeklyCheckIns[weeklyIndex].fromDate) <= new Date(checkIn.date)) {
          // Insert weekly check-in before the daily check-in if it ends before the daily check-in
          if (new Date(this.weeklyCheckIns[weeklyIndex].toDate) < new Date(checkIn.date)) {
            merged.push({ type: 'weekly', data: this.weeklyCheckIns[weeklyIndex] });
            weeklyIndex++;
          } else {
            break;
          }
        }
        // Insert the daily check-in
        merged.push({ type: 'daily', data: checkIn });
      }

      // Insert any remaining weekly check-ins
      while (weeklyIndex < this.weeklyCheckIns.length) {
        merged.push({ type: 'weekly', data: this.weeklyCheckIns[weeklyIndex] });
        weeklyIndex++;
      }

      this.mergedCheckIns = merged;

    },


  }
}
</script>


<style scoped>
.no-border {
  border: none;
  background-color: transparent;
}
.image-no-border {
  border: none; /* Entfernt den Rand */
  width: 50px; /* Setzt die Breite des Bildes */
  height: auto; /* Setzt die Höhe automatisch, um das Seitenverhältnis zu bewahren */
}
</style>