<template>
  <div>
    <RegisterForm v-if="!isRegistrationComplete" @registration-success="handleRegistrationSuccess" />
    <CompleteBanner v-if="isRegistrationComplete" :isRegistered="isRegistrationComplete" />
  </div>
</template>

<script>
import { ref } from 'vue';
import RegisterForm from '../components/RegisterForm.vue';
import CompleteBanner from '../components/CompleteBanner.vue';
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  components: {
    LoadingScreen,
    RegisterForm,
    CompleteBanner,
  },
  setup() {
    const isRegistrationComplete = ref(false);

    const handleRegistrationSuccess = () => {
      isRegistrationComplete.value = true;
    };

    return { isRegistrationComplete, handleRegistrationSuccess };
  },
};
</script>



