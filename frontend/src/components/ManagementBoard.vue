<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const presentations = ref([]);
const newPresentationName = ref('');
const fileInput = ref(null);

onMounted(async () => {
  await fetchPresentations();
});

async function fetchPresentations() {
  try {
    const response = await axios.get('/api/presentations');
    presentations.value = response.data;
  } catch (error) {
    console.error('Failed to fetch presentations:', error);
  }
}

async function createPresentation() {
  if (!newPresentationName.value) return;

  try {
    const response = await axios.post('/api/presentations', { name: newPresentationName.value });
    newPresentationName.value = '';
    await fetchPresentations();
    router.push(`/${response.data.id}`);
  } catch (error) {
    console.error('Failed to create presentation:', error);
  }
}

async function importPresentation(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/presentations/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Import successful:', response.data);
    await fetchPresentations();
  } catch (error) {
    console.error('Failed to import presentation:', error);
  }
}

async function deletePresentation(id) {
  try {
    await axios.delete(`/api/presentations/${id}`);
    await fetchPresentations();
  } catch (error) {
    console.error('Failed to delete presentation:', error);
  }
}

function openPresentation(id) {
  router.push(`/${id}`);
}
</script>

<template>
  <div class="management-board">
    <h2>Presentation Management</h2>
    
    <div class="create-presentation">
      <input v-model="newPresentationName" placeholder="New presentation name" />
      <button @click="createPresentation">Create Presentation</button>
    </div>
    
    <div class="import-presentation">
      <input type="file" ref="fileInput" @change="importPresentation" accept=".pptx" />
      <button @click="() => fileInput.click()">Import Presentation</button>
    </div>
    
    <ul class="presentation-list">
      <li v-for="presentation in presentations" :key="presentation.id">
        {{ presentation.name }}
        <button @click="openPresentation(presentation.id)">Open</button>
        <button @click="deletePresentation(presentation.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.management-board {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.create-presentation, .import-presentation {
  margin-bottom: 20px;
}

input[type="file"] {
  display: none;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.presentation-list {
  list-style-type: none;
  padding: 0;
}

.presentation-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
