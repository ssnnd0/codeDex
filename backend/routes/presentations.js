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

router.post('/', (req, res) => {
  const { name } = req.body;
  const newPresentation = { id: Date.now().toString(), name, slides: [] };
  presentations.push(newPresentation);
  res.status(201).json(newPresentation);
});

router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const importedSlides = await parsePresentation(req.file.path);
    const newPresentation = {
      id: Date.now().toString(),
      name: path.basename(req.file.originalname, path.extname(req.file.originalname)),
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
