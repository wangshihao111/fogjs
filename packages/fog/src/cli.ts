import { program } from 'commander';
import { logger } from './utils';
import yargs from 'yargs';
import Application from './Application';

const args = yargs.parseSync(process.argv.slice(2));

program
  .command('start')
  .description('Start development server')
  .action(() => {
    new Application().init().runCommand('start', args);
  });

program
  .command('build')
  .description('Build the production dist')
  .action(() => {
    new Application().init().runCommand('build', args);
  });

program
  .command('run [command]')
  .description('Run custom commands')
  .allowUnknownOption()
  .action(async (command: string) => {
    try {
      await new Application().init().runCommand(command, args);
    } catch (error) {
      logger.error((<any>error)?.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
