import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const readFile = (filename) => {
  const filepath = path.resolve(process.cwd(), filename);
  const content = fs.readFileSync(filepath, 'utf8');
  return content;
};

const parse = (content) => JSON.parse(content);

const makeLeaf = (key, oldValue, newValue) => ({ key, oldValue, newValue });

const makeTree = (obj1, obj2) => {
  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);

  const onlyInFirst = entries1
    .filter(([key]) => entries2.every(([key2]) => key !== key2))
    .map(([key, value]) => makeLeaf(key, value, undefined));
  const onlyInSecond = entries2
    .filter(([key]) => entries1.every(([key2]) => key !== key2))
    .map(([key, value]) => makeLeaf(key, undefined, value));
  const sameItems = entries1
    .filter(([key]) => entries2.some(([key2]) => key === key2))
    .map(([key, value]) => makeLeaf(key, value, obj2[key]));

  return [...onlyInFirst, ...onlyInSecond, ...sameItems];
};

// на вход лист
const formatLeaf = (leaf) => {
  const { key, oldValue, newValue } = leaf;
  if (oldValue === undefined) return `  + ${key}: ${newValue}`;
  if (newValue === undefined) return `  - ${key}: ${oldValue}`;
  if (oldValue === newValue) return `    ${key}: ${newValue}`;
  return `  - ${key}: ${oldValue}\n  + ${key}: ${newValue}`;
};

const formatTree = (tree) => {
  const sortedDiffs = _.orderBy(tree, ['key'], ['asc']);
  const joinedLeaves = sortedDiffs.map((leaf) => formatLeaf(leaf)).join('\n');
  return `{\n${joinedLeaves}\n}`;
};

const genDiff = (path1, path2) => {
  const content1 = readFile(path1);
  const content2 = readFile(path2);
  const obj1 = parse(content1);
  const obj2 = parse(content2);
  return formatTree(makeTree(obj1, obj2));
};

export default genDiff;
