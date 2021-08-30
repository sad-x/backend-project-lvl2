import yaml from 'js-yaml';
import path from 'path';

// eslint-disable-next-line consistent-return
const getParser = (filePath) => {
  const ext = path.extname(filePath);
  if (ext === '.json') return JSON.parse;
  if (ext === '.yml' || ext === '.yaml') return yaml.load;
};

export default getParser;
