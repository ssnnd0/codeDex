import { read, utils } from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function parsePresentation(filePath) {
  const fileExt = path.extname(filePath).toLowerCase();

  if (fileExt === '.pptx') {
    return await parsePowerPoint(filePath);
  } else {
    throw new Error('Unsupported file format');
  }
}

async function parsePowerPoint(filePath) {
  const workbook = read(fs.readFileSync(filePath));
  const slides = [];

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    // Simplified parsing logic - you may need to enhance this based on your PowerPoint structure
    const slideType = jsonData[0][0] || 'text';
    const slideContent = jsonData.slice(1).map(row => row.join(' ')).join('\n');

    switch (slideType.toLowerCase()) {
      case 'code':
        slides.push({ type: 'code', language: 'javascript', content: slideContent });
        break;
      case 'mcq':
        const [question, ...options] = slideContent.split('\n');
        slides.push({ 
          type: 'mcq', 
          question, 
          options: options.slice(0, -1), 
          correctAnswer: parseInt(options[options.length - 1]) || 0 
        });
        break;
      case 'short-answer':
        slides.push({ type: 'short-answer', question: slideContent });
        break;
      default:
        slides.push({ type: 'text', content: slideContent });
    }
  });

  return slides;
}
