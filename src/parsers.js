import yaml from 'js-yaml';
import path from 'path';

const getParser = (filePath) => {
  const ext = path.extname(filePath);
  if (ext === '.json') return JSON.parse;
  return yaml.load;
};

export default getParser;
