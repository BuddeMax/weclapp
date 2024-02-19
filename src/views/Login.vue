<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoginForm from "@/components/LoginForm.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

let isLoading = ref(true);
const store = useStore();

onMounted(async () => {
  await store.dispatch('checkDemoController');
  isLoading.value = false;
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