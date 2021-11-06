import { resolve } from 'path';
const cwd = process.cwd();

export function resolvePaths() {
  return {
    appSrc: resolve(cwd, 'src/index'),
    publicUrlOrPath: '/',
    appBuild: resolve(cwd, 'dist'),
  };
}
