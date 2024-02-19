<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import LoginForm from "@/components/LoginForm.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

const store = useStore();
let isLoading = ref(store.state.isLoading);  // Reaktive Referenz auf den Store-Zustand

onMounted(async () => {
  await store.dispatch('checkDemoController');
});

// Überwache Änderungen an isLoading
watch(() => store.state.isLoading, (newValue) => {
  isLoading.value = newValue;
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


<style scoped>

</style>