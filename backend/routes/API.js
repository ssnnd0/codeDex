import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/compile', async (req, res) => {
  const { language, code } = req.body;
  
  try {
    const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
      language_id: getLanguageId(language),
      source_code: code,
      stdin: ''
    }, {
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
      }
    });

    const token = response.data.token;
    const result = await getSubmissionResult(token);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Compilation failed' });
  }
});

async function getSubmissionResult(token) {
  const response = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
    headers: {
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
    }
  });
  return response.data;
}

function getLanguageId(language) {
  const languageMap = {
    'javascript': 63,
    'python': 71,
    'java': 62,
  };
  return languageMap[language.toLowerCase()] || 63;
}

export default router;
