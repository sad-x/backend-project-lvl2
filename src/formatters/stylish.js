import _ from 'lodash';
import {
  getKey, getValuePair, getType, getLevel, getStatus, getChildren,
} from '../tree.js';

const makeLine = (level, key, value, sign) => {
  const spacesWithSign = sign === undefined
    ? ' '.repeat(level * 4)
    : `${' '.repeat((level - 1) * 4)}  ${sign} `;
  return `${spacesWithSign}${key}: ${value}`;
};

const makeLinesFromObj = (obj) => {

};

const formatValue = (key, value, level, sign) => {
  if (!_.isObject(value)) makeLine(key, value, level, sign);
  return makeLinesFromObj(key, value, level, sign);
};

const formatTree = (tree) => {
  const sortedDiffs = _.orderBy(tree, ['key'], ['asc']);
  return sortedDiffs
    .map((node) => {
      const key = getKey(node);
      const level = getLevel(node);
      const type = getType(node);
      if (type === 'leaf') {
        const [oldValue, newValue] = getValuePair(node);
        const status = getStatus(node);
        if (status === 'added') {
          return formatValue(key, newValue, level, '+');
        }
      }
      if (type === 'branch') {
        const children = getChildren(node);
        const result = formatTree(children);
        const spaces = ' '.repeat(level * 4);
        const startLine = `${spaces}${key}: {`;
        const endLine = `${spaces}}`;
        return [startLine, ...result, endLine];
      }
      return [];
    })
    .join('\n');
};

export default formatTree;
