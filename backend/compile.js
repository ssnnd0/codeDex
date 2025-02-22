import express from 'express';
import axios from 'axios';

const router = express.Router();

// Language ID mapping for Judge0 API
const LANGUAGE_IDS = {
  'javascript': 63,  // Node.js
  'python': 71,      // Python 3
  'java': 62,       // Java
  'cpp': 54,        // C++
  'csharp': 51,     // C#
};

// Configure Judge0 API
const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const headers = {
  'content-type': 'application/json',
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
};

router.post('/', async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    // Create submission
    const submission = await axios.post(`${JUDGE0_API}/submissions`, {
      source_code: code,
      language_id: languageId,
      stdin: '',
    }, { headers });

    const token = submission.data.token;

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const response = await axios.get(`${JUDGE0_API}/submissions/${token}`, { headers });
      
      if (response.data.status.id > 2) { // Status > 2 means processing is complete
        result = response.data;
        break;
      }

      attempts++;
    }

    if (!result) {
      return res.status(504).json({ error: 'Compilation timeout' });
    }

    // Format the response
    const response = {
      status: result.status.description,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compile_output: result.compile_output || '',
      time: result.time,
      memory: result.memory
    };

    // Check for compilation/runtime errors
    if (result.status.id !== 3) { // 3 = Accepted (success)
      response.error = result.compile_output || result.stderr || 'Execution error';
    }

    res.json(response);

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  res.json(Object.keys(LANGUAGE_IDS));
});

// Test endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
