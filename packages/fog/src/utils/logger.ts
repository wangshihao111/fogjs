import chalk from 'chalk';

export const logger = {
  info: (...args: any[]) => {
    console.log(chalk.blueBright('Info:'), ...args);
  },
  success: (...args: any[]) => {
    console.log(chalk.green('Success:'), ...args);
  },
  error: (...args: any[]) => {
    console.log(chalk.red('Error:'), ...args);
  },
};
