<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor.vue';

const route = useRoute();
const socket = io('http://localhost:3000');

const props = defineProps(['currentSlide']);
const emit = defineEmits(['change-slide']);

const slides = ref([
  { type: 'text', content: 'Welcome to CodeSync!' },
  { type: 'code', language: 'javascript', content: 'console.log("Hello, CodeSync!");' },
  { type: 'question', content: 'What is your favorite programming language?' },
]);

onMounted(() => {
  const roomId = route.params.roomId;
  socket.emit('join-room', roomId);

  socket.on('slide-changed', (slideIndex) => {
    emit('change-slide', slideIndex);
  });
});

watch(() => props.currentSlide, (newSlide) => {
  // Handle slide change
});

function nextSlide() {
  if (props.currentSlide < slides.value.length - 1) {
    emit('change-slide', props.currentSlide + 1);
    socket.emit('slide-change', { roomId: route.params.roomId, slideIndex: props.currentSlide + 1 });
  }
}

function prevSlide() {
  if (props.currentSlide > 0) {
    emit('change-slide', props.currentSlide - 1);
    socket.emit('slide-change', { roomId: route.params.roomId, slideIndex: props.currentSlide - 1 });
  }
}
</script>

<template>
  <div class="presentation">
    <div class="slide">
      <template v-if="slides[currentSlide].type === 'text'">
        <p>{{ slides[currentSlide].content }}</p>
      </template>
      <template v-else-if="slides[currentSlide].type === 'code'">
        <CodeEditor
          :language="slides[currentSlide].language"
          :code="slides[currentSlide].content"
        />
      </template>
      <template v-else-if="slides[currentSlide].type === 'question'">
        <p>{{ slides[currentSlide].content }}</p>
        <input type="text" placeholder="Your answer">
      </template>
    </div>
    <div class="controls">
      <button @click="prevSlide" :disabled="currentSlide === 0">Previous</button>
      <button @click="nextSlide" :disabled="currentSlide === slides.length - 1">Next</button>
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
</style>
