<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import io from 'socket.io-client';
import axios from 'axios';
import CodeEditor from './CodeEditor.vue';
import ManagementConsole from './ManagementConsole.vue';
import MCQSlide from './MCQSlide.vue';
import ShortAnswerSlide from './ShortAnswerSlide.vue';

const route = useRoute();
const router = useRouter();
const socket = io('http://localhost:3000');

const presentation = ref(null);
const currentSlide = ref(parseInt(route.params.slideIndex) || 0);
const isPresenter = ref(false);
const participants = ref([]);

onMounted(async () => {
  await fetchPresentation();
  joinRoom();
});

watch(() => route.params.slideIndex, (newSlideIndex) => {
  if (newSlideIndex !== undefined) {
    currentSlide.value = parseInt(newSlideIndex);
  }
});

async function fetchPresentation() {
  try {
    const response = await axios.get(`/api/presentations/${route.params.code}`);
    presentation.value = response.data;
  } catch (error) {
    console.error('Error fetching presentation:', error);
    alert('Failed to load presentation. Please check the code and try again.');
  }
}

function joinRoom() {
  const roomId = route.params.code;
  const username = route.query.username || prompt('Enter your name:');
  socket.emit('join-room', { roomId, username });

  socket.on('room-joined', (data) => {
    isPresenter.value = data.isPresenter;
    participants.value = data.participants;
  });

  socket.on('slide-changed', (slideIndex) => {
    if (!isPresenter.value) {
      currentSlide.value = slideIndex;
      router.push(`/presentation/${roomId}/${slideIndex}?username=${encodeURIComponent(username)}`);
    }
  });

  socket.on('participants-updated', (updatedParticipants) => {
    participants.value = updatedParticipants;
  });
}

function nextSlide() {
  if (currentSlide.value < presentation.value.slides.length - 1) {
    changeSlide(currentSlide.value + 1);
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    changeSlide(currentSlide.value - 1);
  }
}

function changeSlide(index) {
  currentSlide.value = index;
  router.push(`/presentation/${route.params.code}/${index}?username=${encodeURIComponent(route.query.username)}`);
  if (isPresenter.value) {
    socket.emit('slide-change', { roomId: route.params.code, slideIndex: index });
  }
}

async function updatePresentation(updatedPresentation) {
  try {
    await axios.put(`/api/presentations/${route.params.code}`, updatedPresentation);
    presentation.value = updatedPresentation;
  } catch (error) {
    console.error('Error updating presentation:', error);
  }
}

function handleMCQSubmit(selectedOption) {
  socket.emit('mcq-answer', {
    roomId: route.params.code,
    slideIndex: currentSlide.value,
    answer: selectedOption
  });
}

function handleShortAnswerSubmit(answer) {
  socket.emit('short-answer', {
    roomId: route.params.code,
    slideIndex: currentSlide.value,
    answer
  });
}
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Presentation: {{ presentation?.name }}</h1>
    <div class="slide-container">
      <component :is="presentation?.slides[currentSlide]?.type === 'code' ? CodeEditor : presentation?.slides[currentSlide]?.type === 'mcq' ? MCQSlide : ShortAnswerSlide"
                 :slide="presentation?.slides[currentSlide]"
                 :is-presenter="isPresenter"
                 @mcq-submit="handleMCQSubmit"
                 @short-answer-submit="handleShortAnswerSubmit" />
    </div>
    <div class="controls mt-4">
      <button @click="prevSlide" :disabled="currentSlide === 0" class="btn btn-secondary">Previous</button>
      <button @click="nextSlide" :disabled="currentSlide === presentation?.slides.length - 1" class="btn btn-primary">Next</button>
    </div>
    <div class="participants mt-4">
      <h3>Participants</h3>
      <ul class="list-group">
        <li v-for="participant in participants" :key="participant.id" class="list-group-item">
          {{ participant.username }} <span v-if="participant.isPresenter" class="badge badge-primary">Presenter</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.slide-container {
    margin-bottom: 20px; /* Space below the slide container */
}

.controls {
    display: flex;
    justify-content: space-between; /* Space between buttons */
    margin-top: 20px; /* Space above controls */
}

.participants {
    margin-top: 30px; /* Space above participants list */
}
</style>
