<script setup>
import { ref } from 'vue';
import ManagementBoard from './components/ManagementBoard.vue';

const currentView = ref('management');
</script>

<template>
  <div class="app">
    <header>
      <h1>CodeSync</h1>
    </header>
    <main>
      <ManagementBoard v-if="currentView === 'management'" />
      <router-view v-else></router-view>
    </main>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  text-align: center;
}

main {
  margin-top: 20px;
}
</style>
