<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const presentations = ref([]);
const newPresentationName = ref('');
const fileToUpload = ref(null);

onMounted(async () => {
  await fetchPresentations();
});

async function fetchPresentations() {
  try {
    const response = await axios.get('/api/presentations');
    presentations.value = response.data;
  } catch (error) {
    console.error('Error fetching presentations:', error);
  }
}

async function createPresentation() {
  if (!newPresentationName.value) return;

  try {
    const response = await axios.post('/api/presentations', {
      name: newPresentationName.value,
      language: 'javascript',
      compilerEnabled: true
    });
    await fetchPresentations();
    newPresentationName.value = '';
    router.push(`/presentation/${response.data.id}/0`);
  } catch (error) {
    console.error('Error creating presentation:', error);
  }
}

async function importPresentation() {
  if (!fileToUpload.value) return;

  const formData = new FormData();
  formData.append('file', fileToUpload.value);

  try {
    const response = await axios.post('/api/presentations/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    await fetchPresentations();
    fileToUpload.value = null;
    router.push(`/presentation/${response.data.id}/0`);
  } catch (error) {
    console.error('Error importing presentation:', error);
  }
}

async function deletePresentation(id) {
  try {
    await axios.delete(`/api/presentations/${id}`);
    await fetchPresentations();
  } catch (error) {
    console.error('Error deleting presentation:', error);
  }
}

function openPresentation(id) {
  router.push(`/presentation/${id}/0`);
}
</script>

<template>
  <div class="dashboard">
    <h1>CodeSync Dashboard</h1>
    <div class="create-presentation">
      <input v-model="newPresentationName" placeholder="New Presentation Name" />
      <button @click="createPresentation">Create Presentation</button>
    </div>
    <div class="import-presentation">
      <input type="file" @change="e => fileToUpload = e.target.files[0]" accept=".pptx" />
      <button @click="importPresentation" :disabled="!fileToUpload">Import Presentation</button>
    </div>
    <div class="presentations-list">
      <h2>Your Presentations</h2>
      <ul>
        <li v-for="presentation in presentations" :key="presentation.id">
          {{ presentation.name }}
          <button @click="openPresentation(presentation.id)">Open</button>
          <button @click="deletePresentation(presentation.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.create-presentation, .import-presentation {
  margin-bottom: 20px;
}

input {
  margin-right: 10px;
  padding: 5px;
}

button {
  padding: 5px 10px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
