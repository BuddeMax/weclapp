<template>
  <div class="error-panel">
    <h1>Fehler</h1>
    <ul>
      <li v-for="err in error" :key="err">{{ err }}</li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const error = computed(() => store.state.errors)
</script>

<style scoped>
.error-panel {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
}
</style>