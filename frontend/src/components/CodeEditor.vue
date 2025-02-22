<script setup>
import { ref, onMounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
import axios from 'axios';

const props = defineProps(['language', 'code', 'compilerEnabled', 'isPresenter']);
const editorRef = ref(null);
const output = ref('');
let editor;

onMounted(() => {
  editor = monaco.editor.create(editorRef.value, {
    value: props.code,
    language: props.language,
    theme: 'vs-dark',
    automaticLayout: true,
    readOnly: !props.isPresenter
  });

  editor.onDidChangeModelContent(() => {
    if (props.isPresenter) {
      // Emit changes to other participants
    }
  });
});

watch(() => props.language, (newLanguage) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
  }
});

watch(() => props.isPresenter, (newIsPresenter) => {
  if (editor) {
    editor.updateOptions({ readOnly: !newIsPresenter });
  }
});

async function compileCode() {
  if (!props.compilerEnabled) {
    output.value = 'Compiler is disabled. Enable it in the Management Console to run the code.';
    return;
  }

  try {
    const response = await axios.post('/api/compile', {
      language: props.language,
      code: editor.getValue()
    });
    output.value = response.data.stdout || response.data.stderr || 'Compilation successful';
  } catch (error) {
    output.value = 'Compilation failed: ' + (error.response?.data?.error || 'Unknown error');
  }
}

function formatCode() {
  editor.getAction('editor.action.formatDocument').run();
}
</script>

<template>
  <div class="code-editor">
    <div ref="editorRef" style="height: 300px;"></div>
    <div class="actions">
      <button @click="compileCode" :disabled="!compilerEnabled || !isPresenter">Compile & Run</button>
      <button @click="formatCode" :disabled="!isPresenter">Format Code</button>
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

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
