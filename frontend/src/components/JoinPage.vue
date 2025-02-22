<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { HeroLoginIcon } from '@heroicons/vue/solid';

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
  <div class="container mt-5">
    <h1 class="text-center">Join CodeSync Presentation</h1>
    <div class="join-form">
      <input v-model="joinCode" placeholder="Enter 6-digit code" maxlength="6" class="form-control mb-2" />
      <input v-model="username" placeholder="Enter your name" class="form-control mb-2" />
      <button @click="joinPresentation" class="btn btn-primary">
        <HeroLoginIcon class="h-5 w-5 inline-block" /> Join Presentation
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
