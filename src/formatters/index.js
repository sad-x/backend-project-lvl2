import stylish from './stylish.js';
import json from './json.js';
import plain from './plain.js';

const getFormatter = (formatName) => {
  if (formatName === 'json') return json;
  if (formatName === 'plain') return plain;
  return stylish;
};

export default getFormatter;
