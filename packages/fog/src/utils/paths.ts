import { resolve } from 'path';
const cwd = process.cwd();

export type ResolvedPaths = {
  appEntry: string;
  appSrc: string;
  publicUrlOrPath: string;
  appBuild: string;
  appHtml: string;
};

export function resolvePaths(): ResolvedPaths {
  return {
    appEntry: resolve(cwd, 'src/index'),
    appSrc: resolve(cwd, 'src'),
    publicUrlOrPath: '/',
    appBuild: resolve(cwd, 'dist'),
    appHtml: resolve(cwd, 'public/index.html'),
  };
}
