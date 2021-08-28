import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const getObjectFromFile = (pathToFile) => {
  const file = path.resolve(process.cwd(), pathToFile);
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  return obj;
};

const getDifferences = (obj1, obj2) => {
  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);

  const onlyInFirst = entries1
    .filter(([key]) => entries2.every(([key2]) => key !== key2))
    .map(([key, value]) => ({ key, oldValue: value, newValue: undefined }));
  const onlyInSecond = entries2
    .filter(([key]) => entries1.every(([key2]) => key !== key2))
    .map(([key, value]) => ({ key, oldValue: undefined, newValue: value }));
  const sameItems = entries1
    .filter(([key]) => entries2.some(([key2]) => key === key2))
    .map(([key, value]) => {
      const [, newValue] = entries2.find(([key2]) => key2 === key);
      return ({ key, oldValue: value, newValue });
    });

  console.log(sameItems);
  return [...onlyInFirst, ...onlyInSecond, ...sameItems];
};

const makeLeaf = (key, oldValue, newValue) => {
  if (oldValue === undefined) return `  + ${key}: ${newValue}`;
  if (newValue === undefined) return `  - ${key}: ${oldValue}`;
  if (oldValue === newValue) return `    ${key}: ${newValue}`;
  return `  - ${key}: ${oldValue}\n  + ${key}: ${newValue}`;
};

const sortDifferences = (differences) => {
  const sortedDiffs = _.orderBy(differences, ['key'], ['asc']);
  const joinedLeafs = sortedDiffs.map(({ key, oldValue, newValue }) => makeLeaf(key, oldValue, newValue)).join('\n');
  return `{\n${joinedLeafs}\n}`;
};

const genDiff = (path1, path2) => {
  const obj1 = getObjectFromFile(path1);
  const obj2 = getObjectFromFile(path2);
  return sortDifferences(getDifferences(obj1, obj2));
};

export default genDiff;
