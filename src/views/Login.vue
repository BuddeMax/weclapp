<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoginForm from "@/components/LoginForm.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

const store = useStore();
let isLoading = ref(store.state.isLoading);  // Reaktive Referenz auf den Store-Zustand

onMounted(async () => {
  await store.dispatch('checkDemoController');
  isLoading.value = store.state.isLoading;  // Aktualisieren Sie die lokale Referenz nach dem Dispatch
});
</script>

<template>
  <div v-if="isLoading">
    <LoadingScreen />
  </div>
  <div v-else>
    <LoginForm />
  </div>
</template>


<style scoped>

</style>