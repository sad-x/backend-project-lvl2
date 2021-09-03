/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import getParser from './parsers.js';
import makeTree from './tree.js';

const readFile = (filename) => {
  const filepath = path.resolve(process.cwd(), filename);
  const content = fs.readFileSync(filepath, 'utf8');
  return content;
};

const formatTree = (tree) => {
  const sortedDiffs = _.orderBy(tree, ['key'], ['asc']);
  const joinedLeaves = sortedDiffs.map((leaf) => formatLeaf(leaf)).join('\n');
  return `${joinedLeaves}`;
};

// json.stringify()
const formatLeaf = (leaf) => {
  const {
    key, oldValue, newValue, level, type, children,
  } = leaf;
  const tabs = level === 1 ? '    ' : '  '.repeat(level * 2 - 1);
  if ((_.isObject(oldValue) || _.isObject(newValue)) && type === 'leaf') {
    const data = newValue === undefined ? oldValue : newValue;
  }
  if (type === 'branch') return `${tabs}${key} {\n${formatTree(children)}\n${tabs}}`;
  if (oldValue === undefined) return `${tabs}+ ${key}: ${newValue}`;
  if (newValue === undefined) return `${tabs}- ${key}: ${oldValue}`;
  if (oldValue === newValue) return `${tabs}  ${key}: ${newValue}`;
  return `${tabs}- ${key}: ${oldValue}\n${tabs}+ ${key}: ${newValue}`;
};

// getFormater()
const genDiff = (path1, path2) => {
  const parse = getParser(path1);
  const content1 = readFile(path1);
  const content2 = readFile(path2);
  const obj1 = parse(content1);
  const obj2 = parse(content2);
  const tree = makeTree(obj1, obj2, 1);
  return formatTree(tree);
};

console.log(genDiff('__fixtures__/file1-nest.json', '__fixtures__/file2-nest.json'));

export default genDiff;
