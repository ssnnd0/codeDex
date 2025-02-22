<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  isPresenter: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

const answer = ref('');
const submitted = ref(false);
const responses = ref([]);
const characterLimit = 1000;

watch(() => props.question, () => {
  // Reset when question changes
  answer.value = '';
  submitted.value = false;
});

function submitAnswer() {
  if (!answer.value.trim()) return;
  
  submitted.value = true;
  emit('submit', {
    answer: answer.value,
    timestamp: new Date().toISOString()
  });
}

function handleResponse(response) {
  responses.value.push(response);
}

function getRemainingCharacters() {
  return characterLimit - answer.value.length;
}

function downloadResponses() {
  const csvContent = 'data:text/csv;charset=utf-8,' + 
    'Timestamp,Response\n' +
    responses.value.map(r => `"${r.timestamp}","${r.answer.replace(/"/g, '""')}"`).join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `responses_${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="short-answer-slide">
    <div class="question">
      <h3>{{ question }}</h3>
    </div>

    <div v-if="!isPresenter" class="answer-section">
      <textarea 
        v-model="answer"
        :disabled="submitted"
        :maxlength="characterLimit"
        placeholder="Type your answer here..."
        rows="6"
      ></textarea>
      <div class="character-count" :class="{ 'near-limit': getRemainingCharacters() < 50 }">
        {{ getRemainingCharacters() }} characters remaining
      </div>
      <button 
        @click="submitAnswer" 
        :disabled="!answer.trim() || submitted"
      >
        Submit Answer
      </button>
      <div v-if="submitted" class="submission-confirmation">
        Your answer has been submitted successfully!
      </div>
    </div>

    <!-- Presenter View -->
    <div v-if="isPresenter" class="presenter-view">
      <div class="responses-header">
        <h4>Responses ({{ responses.length }})</h4>
        <button @click="downloadResponses" :disabled="responses.length === 0">
          Download Responses (CSV)
        </button>
      </div>
      
      <div class="responses-list" v-if="responses.length > 0">
        <div v-for="(response, index) in responses" :key="index" class="response-item">
          <div class="response-meta">
            Response #{{ index + 1 }} - 
            {{ new Date(response.timestamp).toLocaleString() }}
          </div>
          <div class="response-content">
            {{ response.answer }}
          </div>
        </div>
      </div>
      
      <div v-else class="no-responses">
        No responses yet.
      </div>
    </div>
  </div>
</template>

<style scoped>
.short-answer-slide {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.question {
  margin-bottom: 20px;
  text-align: left;
}

.question h3 {
  font-size: 1.2rem;
  color: #333;
}

.answer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.character-count {
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.character-count.near-limit {
  color: #dc3545;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-start;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submission-confirmation {
  padding: 10px;
  background-color: #e7f6e7;
  color: #28a745;
  border-radius: 4px;
}

.presenter-view {
  margin-top: 20px;
}

.responses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.response-item {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.response-meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.response-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.no-responses {
  text-align: center;
  color: #666;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>
