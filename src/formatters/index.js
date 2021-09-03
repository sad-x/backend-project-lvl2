import stylish from './stylish.js';
import json from './json.js';

const getFormatter = (formatName) => {
  if (formatName === 'stylish') return stylish;
  return json;
};

export default getFormatter;
