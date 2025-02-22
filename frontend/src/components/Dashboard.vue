<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { HeroPlusIcon, HeroUploadIcon, HeroEyeIcon, HeroTrashIcon } from '@heroicons/vue/solid';

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
    router.push(`/presentation/${response.data.code}/0`);
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
    router.push(`/presentation/${response.data.code}/0`);
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
  <div class="container mt-5">
    <h1 class="text-center">CodeSync Dashboard</h1>
    <div class="mb-4">
      <input v-model="newPresentationName" class="form-control" placeholder="New Presentation Name" />
      <button @click="createPresentation" class="btn btn-primary mt-2">
        <HeroPlusIcon class="h-5 w-5 inline-block" /> Create Presentation
      </button>
    </div>
    <div class="mb-4">
      <input type="file" @change="e => fileToUpload = e.target.files[0]" accept=".pptx" class="form-control" />
      <button @click="importPresentation" :disabled="!fileToUpload" class="btn btn-success mt-2">
        <HeroUploadIcon class="h-5 w-5 inline-block" /> Import Presentation
      </button>
    </div>
    <h2>Your Presentations</h2>
    <ul class="list-group">
      <li v-for="presentation in presentations" :key="presentation.id" class="list-group-item d-flex justify-content-between align-items-center">
        {{ presentation.name }}
        <div>
          <button @click="openPresentation(presentation.code)" class="btn btn-info btn-sm">
            <HeroEyeIcon class="h-5 w-5 inline-block" /> Open
          </button>
          <button @click="deletePresentation(presentation.code)" class="btn btn-danger btn-sm">
            <HeroTrashIcon class="h-5 w-5 inline-block" /> Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
