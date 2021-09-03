/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import getParser from './parsers.js';
import makeTree from './tree.js';
import getFormatter from './formatters/index.js';

const readFile = (filename) => {
  const filepath = path.resolve(process.cwd(), filename);
  const content = fs.readFileSync(filepath, 'utf8');
  return content;
};

// getFormater()
const genDiff = (path1, path2, formatter = 'json') => {
  const parse = getParser(path1);
  const content1 = readFile(path1);
  const content2 = readFile(path2);
  const obj1 = parse(content1);
  const obj2 = parse(content2);
  const tree = makeTree(obj1, obj2, 1);
  const formatTree = getFormatter(formatter);
  return formatTree(tree);
};

console.log(genDiff('__fixtures__/file1-nest.json', '__fixtures__/file2-nest.json'));

export default genDiff;
