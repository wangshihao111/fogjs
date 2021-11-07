import { resolve } from 'path';
const cwd = process.cwd();

export type ResolvedPaths = {
  appEntry: string;
  appSrc: string;
  publicUrlOrPath: string;
  appBuild: string;
  appHtml: string;
  appPublic: string;
};

export function resolvePaths(): ResolvedPaths {
  return {
    appEntry: resolve(cwd, 'src/index'),
    appSrc: resolve(cwd, 'src'),
    publicUrlOrPath: '/',
    appBuild: resolve(cwd, 'dist'),
    appPublic: resolve(cwd, 'public'),
    appHtml: resolve(cwd, 'public/index.html'),
  };
}
