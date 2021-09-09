/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test.each([
  ['json'],
  ['yml'],
])('genDiff', (extention) => {
  const input1Path = getFixturePath(`file1-nest.${extention}`);
  const input2Path = getFixturePath(`file2-nest.${extention}`);
  const outputPath = getFixturePath('output-nest.txt');
  const expected = readFileSync(outputPath, 'utf-8');
  expect(genDiff(input1Path, input2Path, 'stylish')).toEqual(expected);
});

test('gendiff plain', () => {
  const input1Path = getFixturePath('file1-nest.json');
  const input2Path = getFixturePath('file2-nest.yml');
  const outputPath = getFixturePath('output-plain.txt');
  const expected = readFileSync(outputPath, 'utf-8');
  expect(genDiff(input1Path, input2Path, 'plain')).toEqual(expected);
});
