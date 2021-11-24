import start from './start';
import { CommandFn, ObjectType } from '../types';
import build from './build';

export { default as start } from './start';

export { default as build } from './build';

const buildInCommands: ObjectType<CommandFn> = {
  build: (args, ctx) => {
    build(ctx);
  },
  start: (args, ctx) => {
    start(ctx);
  },
};

export { buildInCommands };
