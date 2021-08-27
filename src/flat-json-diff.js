import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';

const getObjectFromFile = (pathToFile) => {
  const file = path.resolve(process.cwd(), pathToFile);
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  return obj;
};

const getDifferences = (obj1, obj2) => {
  const arr1 = Object.entries(obj1);
  const arr2 = Object.entries(obj2);
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const values1 = Object.values(obj1);
  const values2 = Object.values(obj2);

  // status 0: ' ', 1: '-', 2: '+'

  const onlyInFirst = arr1
    .filter((item) => !keys2.includes(item[0]))
    .map((item) => ({ key: item[0], value: item[1], status: 1 }));
  const onlyInSecond = arr2
    .filter((item) => !keys1.includes(item[0]))
    .map((item) => ({ key: item[0], value: item[1], status: 2 }));
  const sameItems = arr1
    .filter((item) => keys2.includes(item[0]) && values2.includes(item[1]))
    .map((item) => ({ key: item[0], value: item[1], status: 0 }));
  const notSameItems1 = arr1
    .filter((item) => keys2.includes(item[0]) && !values2.includes(item[1]))
    .map((item) => ({ key: item[0], value: item[1], status: 1 }));
  const notSameItems2 = arr2
    .filter((item) => keys1.includes(item[0]) && !values1.includes(item[1]))
    .map((item) => ({ key: item[0], value: item[1], status: 2 }));

  const all = [...onlyInFirst, ...onlyInSecond, ...sameItems, ...notSameItems1, ...notSameItems2];
  return all;
};

const getStatus = (status) => {
  if (status === 0) return '    ';
  if (status === 1) return '  - ';
  return '  + ';
};

const sortDifferences = (differences) => {
  const sortedDiffs = _.orderBy(differences, ['key', 'status'], ['asc', 'asc']);
  const result = sortedDiffs.reduce((acc, item) => {
    const status = getStatus(item.status);
    const str = status.concat(item.key, ': ', item.value);
    return acc.concat(str, '\n');
  }, '');
  const res = result.concat('}');
  const r = '{\n'.concat(res);
  return r;
};

const genDiff = (path1, path2) => {
  const obj1 = getObjectFromFile(path1);
  const obj2 = getObjectFromFile(path2);
  return sortDifferences(getDifferences(obj1, obj2));
};

export default genDiff;
