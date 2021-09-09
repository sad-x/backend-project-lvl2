/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import _ from 'lodash';
import {
  getKey, getValuePair, getType, getStatus, getChildren,
} from '../tree.js';

const makeLine = (path, status, oldValue, newValue) => {
  if (status === 'added') return `Property '${path}' was added with value: ${newValue}`;
  if (status === 'deleted') return `Property '${path}' was removed`;
  return `Property '${path}' was updated. From ${oldValue} to ${newValue}`;
};

const normalizeValue = (value) => {
  if (typeof (value) === 'string') return `'${value}'`;
  const v = _.isObject(value) ? '[complex value]' : value;
  return v;
};

const plainFormatTree = (tree, path = '') => {
  const result = _.orderBy(tree, ['key'])
    .filter((node) => {
      if (getStatus(node) === 'unchanged') return false;
      return true;
    })
    .map((node) => {
      const type = getType(node);
      const name = getKey(node);
      const status = getStatus(node);
      const newPath = path === '' ? name : `${path}.${name}`;
      const [oldValue, newValue] = getValuePair(node);
      if (type === 'branch') {
        const children = getChildren(node);
        return plainFormatTree(children, newPath);
      }
      if (type === 'leaf') {
        const ov = normalizeValue(oldValue);
        const nv = normalizeValue(newValue);
        return makeLine(newPath, status, ov, nv);
      }
    })
    .join('\n');
  return result;
};

export default plainFormatTree;
