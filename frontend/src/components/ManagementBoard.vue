<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps(['presentation']);
const emit = defineEmits(['update:presentation']);

const selectedLanguage = ref(props.presentation.language || 'javascript');
const compilerEnabled = ref(props.presentation.compilerEnabled !== false);

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];

watch([selectedLanguage, compilerEnabled], () => {
  emit('update:presentation', {
    ...props.presentation,
    language: selectedLanguage.value,
    compilerEnabled: compilerEnabled.value,
  });
});

function addSlide(type) {
  const newSlide = { type, content: '' };
  if (type === 'code') {
    newSlide.language = selectedLanguage.value;
  } else if (type === 'mcq') {
    newSlide.question = '';
    newSlide.options = ['', '', '', ''];
    newSlide.correctAnswer = 0;
  } else if (type === 'short-answer') {
    newSlide.question = '';
  }
  emit('update:presentation', {
    ...props.presentation,
    slides: [...props.presentation.slides, newSlide],
  });
}

function deleteSlide(index) {
  const updatedSlides = [...props.presentation.slides];
  updatedSlides.splice(index, 1);
  emit('update:presentation', {
    ...props.presentation,
    slides: updatedSlides,
  });
}

function navigateToSlide(index) {
  router.push(`/${route.params.id}/${index}`);
}
</script>

<template>
  <div class="management-console">
    <h2>Management Console</h2>
    <div class="settings">
      <label>
        Language:
        <select v-model="selectedLanguage">
          <option v-for="lang in languages" :key="lang.value" :value="lang.value">
            {{ lang.label }}
          </option>
        </select>
      </label>
      <label>
        Compiler:
        <input type="checkbox" v-model="compilerEnabled">
        {{ compilerEnabled ? 'Enabled' : 'Disabled' }}
      </label>
    </div>
    <div class="slide-management">
      <h3>Slides</h3>
      <button @click="addSlide('text')">Add Text Slide</button>
      <button @click="addSlide('code')">Add Code Slide</button>
      <button @click="addSlide('mcq')">Add MCQ Slide</button>
      <button @click="addSlide('short-answer')">Add Short Answer Slide</button>
      <ul class="slide-list">
        <li v-for="(slide, index) in props.presentation.slides" :key="index">
          Slide {{ index + 1 }}: {{ slide.type }}
          <button @click="navigateToSlide(index)">View</button>
          <button @click="deleteSlide(index)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.management-console {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.settings {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.slide-management {
  margin-top: 20px;
}

.slide-list {
  list-style-type: none;
  padding: 0;
}

.slide-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
