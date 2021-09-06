import { program } from 'commander';
import genDiff from './gendiff.js';

export default () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format', 'stylish')
    .argument('<filepath1>')
    .argument('<filepath2>')
    .action((filepath1, filepath2, typeObj) => {
      const type = typeObj.format;
      console.log(genDiff(filepath1, filepath2, type));
    })
    .parse();
};
