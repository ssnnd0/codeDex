<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  isPresenter: {
    type: Boolean,
    default: false
  },
  correctAnswer: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['submit', 'updateStats']);

const selectedOption = ref(null);
const submitted = ref(false);
const stats = ref({
  total: 0,
  correct: 0,
  answers: Array(props.options.length).fill(0)
});

watch(() => props.question, () => {
  // Reset when question changes
  selectedOption.value = null;
  submitted.value = false;
});

function submitAnswer() {
  if (selectedOption.value === null) return;
  
  submitted.value = true;
  const isCorrect = selectedOption.value === props.correctAnswer;
  
  // Update statistics
  stats.value.total++;
  if (isCorrect) stats.value.correct++;
  stats.value.answers[selectedOption.value]++;
  
  emit('submit', {
    selected: selectedOption.value,
    isCorrect,
    stats: stats.value
  });
}

function getOptionClass(index) {
  if (!submitted.value) return '';
  if (index === props.correctAnswer) return 'correct';
  if (index === selectedOption.value && index !== props.correctAnswer) return 'incorrect';
  return '';
}

function getPercentage(count) {
  if (stats.value.total === 0) return 0;
  return Math.round((count / stats.value.total) * 100);
}
</script>

<template>
  <div class="mcq-slide">
    <div class="question">
      <h3>{{ question }}</h3>
    </div>

    <div class="options">
      <div v-for="(option, index) in options" :key="index" class="option-container">
        <label :class="['option', getOptionClass(index)]">
          <input 
            type="radio" 
            :value="index" 
            v-model="selectedOption"
            :disabled="submitted || isPresenter"
          >
          <span class="option-text">{{ option }}</span>
        </label>
        
        <!-- Show statistics for presenter -->
        <div v-if="isPresenter && stats.total > 0" class="stats">
          {{ stats.answers[index] }} responses ({{ getPercentage(stats.answers[index]) }}%)
          <div class="progress-bar">
            <div 
              class="progress" 
              :style="{ width: getPercentage(stats.answers[index]) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <button 
        v-if="!isPresenter" 
        @click="submitAnswer" 
        :disabled="selectedOption === null || submitted"
      >
        Submit Answer
      </button>
    </div>

    <div v-if="submitted" class="feedback">
      <p v-if="selectedOption === props.correctAnswer" class="correct-feedback">
        Correct! Well done!
      </p>
      <p v-else class="incorrect-feedback">
        Incorrect. The correct answer was: {{ options[props.correctAnswer] }}
      </p>
    </div>

    <!-- Presenter Statistics Summary -->
    <div v-if="isPresenter && stats.total > 0" class="presenter-stats">
      <h4>Response Summary</h4>
      <p>Total Responses: {{ stats.total }}</p>
      <p>Correct Answers: {{ stats.correct }} ({{ getPercentage(stats.correct) }}%)</p>
    </div>
  </div>
</template>

<style scoped>
.mcq-slide {
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

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.option-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.option {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.option:hover:not(.correct):not(.incorrect) {
  background-color: #f5f5f5;
}

.option input[type="radio"] {
  margin-right: 10px;
}

.option-text {
  font-size: 1rem;
}

.correct {
  background-color: #e7f6e7;
  border-color: #28a745;
}

.incorrect {
  background-color: #ffebee;
  border-color: #dc3545;
}

.actions {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.feedback {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
}

.correct-feedback {
  color: #28a745;
}

.incorrect-feedback {
  color: #dc3545;
}

.stats {
  flex: 1;
  font-size: 0.9rem;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.presenter-stats {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.presenter-stats h4 {
  margin-bottom: 10px;
  color: #333;
}
</style>
