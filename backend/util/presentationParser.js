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

    const slideContent = jsonData.map(row => row.join(' ')).join('\n');
    slides.push({ type: 'text', content: slideContent });
  });

  return slides;
}
