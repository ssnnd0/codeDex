import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { parsePresentation } from '../utils/presentationParser.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

let presentations = [];

router.get('/', (req, res) => {
  res.json(presentations);
});

router.get('/:id', (req, res) => {
  const presentation = presentations.find(p => p.code === req.params.id);
  if (presentation) {
    res.json(presentation);
  } else {
    res.status(404).json({ error: 'Presentation not found' });
  }
});

router.post('/', (req, res) => {
  const { name, language, compilerEnabled } = req.body;
  const newPresentation = { 
    id: Date.now().toString(), 
    name, 
    language: language || 'javascript',
    compilerEnabled: compilerEnabled !== false,
    slides: [] 
  };
  presentations.push(newPresentation);
  res.status(201).json(newPresentation);
});

router.put('/:id', (req, res) => {
  const index = presentations.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    presentations[index] = { ...presentations[index], ...req.body };
    res.json(presentations[index]);
  } else {
    res.status(404).json({ error: 'Presentation not found' });
  }
});

router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const importedSlides = await parsePresentation(req.file.path);
    const newPresentation = {
      code: Date.now().toString(),
      name: path.basename(req.file.originalname, path.extname(req.file.originalname)),
      language: 'javascript',
      compilerEnabled: true,
      slides: importedSlides
    };
    presentations.push(newPresentation);

    await promisify(fs.unlink)(req.file.path);

    res.status(201).json(newPresentation);
  } catch (error) {
    console.error('Error importing presentation:', error);
    res.status(500).send('Failed to import presentation.');
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  presentations = presentations.filter(p => p.id !== id);
  res.sendStatus(204);
});

export default router;
