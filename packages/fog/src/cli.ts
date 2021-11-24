import { program } from 'commander';
import Application from './Application';

program
  .command('start')
  .description('Start development server')
  .action(() => {
    new Application().init().runCommand('start', {});
  });

program
  .command('build')
  .description('Build the production dist')
  .action(() => {
    new Application().init().runCommand('build', {});
  });

program.parse(process.argv);
