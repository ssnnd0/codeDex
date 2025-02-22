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

const emit = defineEmits(['submit']);

const selectedOption = ref(null);
const submitted = ref(false);

watch(() => props.question, () => {
  selectedOption.value = null;
  submitted.value = false;
});

function submitAnswer() {
  if (selectedOption.value === null) return;
  
  submitted.value = true;
  emit('submit', selectedOption.value);
}

function getOptionClass(index) {
  if (!submitted.value) return '';
  if (index === props.correctAnswer) return 'bg-success text-white';
  if (index === selectedOption.value && index !== props.correctAnswer) return 'bg-danger text-white';
  return '';
}
</script>

<template>
  <div class="mcq-slide">
    <h3>{{ question }}</h3>
    <div class="list-group">
      <div v-for="(option, index) in options" :key="index" class="list-group-item">
        <label :class="['form-check-label', getOptionClass(index)]">
          <input type="radio" :value="index" v-model="selectedOption" class="form-check-input" />
          {{ option }}
        </label>
      </div>
    </div>
    <button @click="submitAnswer" class="btn btn-primary mt-2" :disabled="submitted">Submit Answer</button>
  </div>
</template>

<style scoped>
.mcq-slide {
    margin-top: 20px; /* Space above the MCQ slide */
}

.form-check-label {
    cursor: pointer; /* Pointer cursor for labels */
}

.btn-primary {
    width: 100%; /* Full width for submit button */
}
</style>
