/* eslint-disable no-else-return */
import _ from 'lodash';
import {
  getKey, getValuePair, getType, getLevel, getStatus, getChildren,
} from '../tree.js';

const makeSpacesAndSign = (level, sign) => {
  const spaces = sign === undefined
    ? ' '.repeat(level * 4)
    : `${' '.repeat((level - 1) * 4)}  ${sign} `;
  return spaces;
};

const makeLine = (key, value, level, sign) => {
  const spacesWithSign = makeSpacesAndSign(level, sign);
  return `${spacesWithSign}${key}: ${value}`;
};

const makeLinesFromObj = (key, value, level, sign) => {
  if (_.isObject(value)) {
    const entries = Object.entries(value);
    const joinedLines = entries.map(([k, v]) => makeLinesFromObj(k, v, level + 1)).join('\n');
    return `${makeSpacesAndSign(level, sign)}${key}: {\n${joinedLines}\n${makeSpacesAndSign(level)}}`;
  }
  return makeLine(key, value, level);
};

const formatValue = (key, value, level, sign) => {
  if (!_.isObject(value)) return makeLine(key, value, level, sign);
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
        } else if (status === 'deleted') {
          return formatValue(key, oldValue, level, '-');
        } else if (status === 'unchanged') {
          return formatValue(key, oldValue, level, undefined);
        } else {
          return `${formatValue(key, oldValue, level, '-')}\n${formatValue(key, newValue, level, '+')}`;
        }
      }
      if (type === 'branch') {
        const children = getChildren(node);
        const result = formatTree(children);
        const spaces = ' '.repeat(level * 4);
        const startLine = `${spaces}${key}: {`;
        const endLine = `${spaces}}`;
        return [startLine, result, endLine].join('\n');
      }
      return [];
    })
    .join('\n');
};

export default formatTree;
