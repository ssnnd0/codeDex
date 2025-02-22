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
    const response = await axios.get(`/api/presentations/${route.params.id}`);
    presentation.value = response.data;
  } catch (error) {
    console.error('Error fetching presentation:', error);
  }
}

function joinRoom() {
  const roomId = route.params.id;
  const username = prompt('Enter your name:');
  socket.emit('join-room', { roomId, username });

  socket.on('room-joined', (data) => {
    isPresenter.value = data.isPresenter;
    participants.value = data.participants;
  });

  socket.on('slide-changed', (slideIndex) => {
    if (!isPresenter.value) {
      currentSlide.value = slideIndex;
      router.push(`/presentation/${roomId}/${slideIndex}`);
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
  router.push(`/presentation/${route.params.id}/${index}`);
  if (isPresenter.value) {
    socket.emit('slide-change', { roomId: route.params.id, slideIndex: index });
  }
}

async function updatePresentation(updatedPresentation) {
  try {
    await axios.put(`/api/presentations/${route.params.id}`, updatedPresentation);
    presentation.value = updatedPresentation;
  } catch (error) {
    console.error('Error updating presentation:', error);
  }
}

function handleMCQSubmit(selectedOption) {
  socket.emit('mcq-answer', {
    roomId: route.params.id,
    slideIndex: currentSlide.value,
    answer: selectedOption
  });
}

function handleShortAnswerSubmit(answer) {
  socket.emit('short-answer', {
    roomId: route.params.id,
    slideIndex: currentSlide.value,
    answer
  });
}
</script>

<template>
  <div class="presentation" v-if="presentation">
    <ManagementConsole 
      v-if="isPresenter" 
      :presentation="presentation" 
      @update:presentation="updatePresentation" 
    />
    <div class="slide">
      <template v-if="presentation.slides[currentSlide].type === 'text'">
        <p>{{ presentation.slides[currentSlide].content }}</p>
      </template>
      <template v-else-if="presentation.slides[currentSlide].type === 'code'">
        <CodeEditor
          :language="presentation.slides[currentSlide].language"
          :code="presentation.slides[currentSlide].content"
          :compiler-enabled="presentation.compilerEnabled"
          :is-presenter="isPresenter"
        />
      </template>
      <template v-else-if="presentation.slides[currentSlide].type === 'mcq'">
        <MCQSlide
          :question="presentation.slides[currentSlide].question"
          :options="presentation.slides[currentSlide].options"
          :is-presenter="isPresenter"
          @submit="handleMCQSubmit"
        />
      </template>
      <template v-else-if="presentation.slides[currentSlide].type === 'short-answer'">
        <ShortAnswerSlide
          :question="presentation.slides[currentSlide].question"
          :is-presenter="isPresenter"
          @submit="handleShortAnswerSubmit"
        />
      </template>
    </div>
    <div class="controls" v-if="isPresenter">
      <button @click="prevSlide" :disabled="currentSlide === 0">Previous</button>
      <button @click="nextSlide" :disabled="currentSlide === presentation.slides.length - 1">Next</button>
    </div>
    <div class="participants">
      <h3>Participants</h3>
      <ul>
        <li v-for="participant in participants" :key="participant.id">
          {{ participant.username }} {{ participant.isPresenter ? '(Presenter)' : '' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.presentation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide {
  width: 100%;
  min-height: 300px;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.participants {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  padding: 10px;
}

.participants ul {
  list-style-type: none;
  padding: 0;
}

.participants li {
  margin-bottom: 5px;
}
</style>
