import { program } from 'commander';
import { start, build } from './commands';

program
  .command('start')
  .description('Start development server')
  .action(() => {
    start();
  });

program
  .command('build')
  .description('Build the production dist')
  .action(() => {
    build();
  });

program.parse(process.argv);
