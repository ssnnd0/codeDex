<script setup>
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor';
import axios from 'axios';

const props = defineProps(['language', 'code']);
const editorRef = ref(null);
const output = ref('');

onMounted(() => {
  const editor = monaco.editor.create(editorRef.value, {
    value: props.code,
    language: props.language,
    theme: 'vs-dark',
    automaticLayout: true
  });

  editor.onDidChangeModelContent(() => {
    // Handle code changes
  });
});

async function compileCode() {
  try {
    const response = await axios.post('/api/compile', {
      language: props.language,
      code: monaco.editor.getModels()[0].getValue()
    });
    output.value = response.data.stdout || response.data.stderr || 'Compilation successful';
  } catch (error) {
    output.value = 'Compilation failed';
  }
}

function formatCode() {
  monaco.editor.getModels()[0].setValue(
    monaco.editor.getModels()[0].getValue()
  );
}
</script>

<template>
  <div class="code-editor">
    <div ref="editorRef" style="height: 300px;"></div>
    <div class="actions">
      <button @click="compileCode">Compile & Run</button>
      <button @click="formatCode">Format Code</button>
    </div>
    <div class="output">
      <h3>Output:</h3>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<style scoped>
.code-editor {
  width: 100%;
}

.actions {
  margin-top: 10px;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.output {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
