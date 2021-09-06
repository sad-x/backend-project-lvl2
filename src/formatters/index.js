import stylish from './stylish.js';
import json from './json.js';

const getFormatter = (formatName) => {
  if (formatName === 'json') return json;
  return stylish;
};

export default getFormatter;
