import start from './start';
import { CommandFn, ObjectType } from '../types';
import build from './build';
import { autoCache } from './build-cache';

export { default as start } from './start';

export { default as build } from './build';

const buildInCommands: ObjectType<CommandFn> = {
  build: (args, ctx) => {
    build(ctx);
  },
  start: (args, ctx) => {
    start(ctx);
  },
  'build:mf': async (args, ctx) => {
    await autoCache(ctx, {
      force: args.force,
      name: args.name,
    });
  },
};

export { buildInCommands };
