import { ResolvedPaths, resolvePaths } from './utils/paths';

export interface ConfigContextType {
  entry: string;
  env: string;
  paths: ResolvedPaths;
  cwd: string;
}

export function createContext(opts: {
  env: string;
  cwd?: string;
}): ConfigContextType {
  const { env, cwd } = opts;
  return {
    entry: '',
    env,
    paths: resolvePaths(),
    cwd: cwd || process.cwd(),
  };
}
