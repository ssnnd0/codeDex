<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor.vue';
import ManagementConsole from './ManagementConsole.vue';

const route = useRoute();
const router = useRouter();
const socket = io('http://localhost:3000');

const presentation = ref({
  id: route.params.id,
  language: 'javascript',
  compilerEnabled: true,
  slides: [
    { type: 'text', content: 'Welcome to CodeSync!' },
    { type: 'code', language: 'javascript', content: 'console.log("Hello, CodeSync!");' },
    { type: 'mcq', question: 'What is your favorite programming language?', options: ['JavaScript', 'Python', 'Java', 'C++'], correctAnswer: 0 },
    { type: 'short-answer', question: 'Explain the concept of recursion.' },
  ],
});

const currentSlide = ref(parseInt(route.params.slideIndex) || 0);

onMounted(() => {
  const roomId = route.params.id;
  socket.emit('join-room', roomId);

  socket.on('slide-changed', (slideIndex) => {
    currentSlide.value = slideIndex;
    router.push(`/${roomId}/${slideIndex}`);
  });
});

watch(() => route.params.slideIndex, (newSlideIndex) => {
  if (newSlideIndex !== undefined) {
    currentSlide.value = parseInt(newSlideIndex);
  }
});

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
  router.push(`/${route.params.id}/${index}`);
  socket.emit('slide-change', { roomId: route.params.id, slideIndex: index });
}

function updatePresentation(updatedPresentation) {
  presentation.value = updatedPresentation;
}

function submitMCQ(selectedOption) {
  const currentMCQ = presentation.value.slides[currentSlide.value];
  if (selectedOption === currentMCQ.correctAnswer) {
    alert('Correct answer!');
  } else {
    alert('Incorrect. Try again!');
  }
}

function submitShortAnswer(answer) {
  alert(`Your answer has been submitted: ${answer}`);
  // In a real application, you would send this to the server for review
}
</script>

<template>
  <div class="presentation">
    <ManagementConsole :presentation="presentation" @update:presentation="updatePresentation" />
    <div class="slide">
      <template v-if="presentation.slides[currentSlide].type === 'text'">
        <p>{{ presentation.slides[currentSlide].content }}</p>
      </template>
      <template v-else-if="presentation.slides[currentSlide].type === 'code'">
        <CodeEditor
          :language="presentation.slides[currentSlide].language"
          :code="presentation.slides[currentSlide].content"
          :compiler-enabled="presentation.compilerEnabled"
        />
      </template>
      <template v-else-if="presentation.slides[currentSlide].type === 'mcq'">
        <h3>{{ presentation.slides[currentSlide].question }}</h3>
        <ul>
          <li v-for="(option, index) in presentation.slides[currentSlide].options" :key="index">
            <button @click="submitMCQ(index)">{{ option }}</button>
          </li>
        </ul>
      </template>
      <template v-else-if="presentation.slides[currentSlide].type === 'short-answer'">
        <h3>{{ presentation.slides[currentSlide].question }}</h3>
        <textarea v-model="presentation.slides[currentSlide].answer" rows="4" cols="50"></textarea>
        <button @click="submitShortAnswer(presentation.slides[currentSlide].answer)">Submit</button>
      </template>
    </div>
    <div class="controls">
      <button @click="prevSlide" :disabled="currentSlide === 0">Previous</button>
      <button @click="nextSlide" :disabled="currentSlide === presentation.slides.length - 1">Next</button>
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

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
