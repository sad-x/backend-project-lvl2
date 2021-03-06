import _ from 'lodash';

const getStatus = (node) => node.status;
const getKey = (node) => node.key;
const getValuePair = (node) => ([node.oldValue, node.newValue]);
const getLevel = (node) => node.level;
const getType = (node) => node.type;
const getChildren = (node) => node.children;

const makeStatus = (oldValue, newValue) => {
  if (oldValue === undefined && newValue !== undefined) return 'added';
  if (oldValue !== undefined && newValue === undefined) return 'deleted';
  if (oldValue === newValue) return 'unchanged';
  return 'changed';
};

const makeLeaf = (key, oldValue, newValue, level, type) => {
  const status = makeStatus(oldValue, newValue);
  return ({
    key, oldValue, newValue, level, status, type,
  });
};

const makeBranch = (key, level, type, children) => ({
  key, level, type, children,
});

const makeTree = (obj1, obj2, level) => {
  const entries1 = Object.entries(obj1);
  const entries2 = Object.entries(obj2);

  const onlyInFirst = entries1
    .filter(([key]) => entries2.every(([key2]) => key !== key2))
    .map(([key, value]) => makeLeaf(key, value, undefined, level, 'leaf'));
  const onlyInSecond = entries2
    .filter(([key]) => entries1.every(([key2]) => key !== key2))
    .map(([key, value]) => makeLeaf(key, undefined, value, level, 'leaf'));
  const sameItems = entries1
    .filter(([key]) => entries2.some(([key2]) => key === key2))
    .map(([key, value]) => {
      if (_.isObject(value) && _.isObject(obj2[key])) {
        const children = makeTree(value, obj2[key], level + 1);
        return makeBranch(key, level, 'branch', children);
      }
      return makeLeaf(key, value, obj2[key], level, 'leaf');
    });
  return [...onlyInFirst, ...onlyInSecond, ...sameItems];
};

export default makeTree;
export {
  getKey, getValuePair, getType, getLevel, getStatus, getChildren,
};
