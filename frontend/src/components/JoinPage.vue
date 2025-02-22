<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const joinCode = ref('');
const username = ref('');

function joinPresentation() {
  if (joinCode.value && username.value) {
    router.push(`/presentation/${joinCode.value}/0?username=${encodeURIComponent(username.value)}`);
  }
}
</script>

<template>
  <div class="join-page">
    <h1>Join CodeSync Presentation</h1>
    <div class="join-form">
      <input v-model="joinCode" placeholder="Enter 6-digit code" maxlength="6" />
      <input v-model="username" placeholder="Enter your name" />
      <button @click="joinPresentation">Join Presentation</button>
    </div>
  </div>
</template>

<style scoped>
.join-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.join-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

input {
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
