import { ResolvedPaths, resolvePaths } from './utils/paths';

export interface ConfigContextType {
  entry: string;
  env: string;
  paths: ResolvedPaths;
}

export function createContext(opts: { env: string }): ConfigContextType {
  const { env } = opts;
  return {
    entry: '',
    env,
    paths: resolvePaths(),
  };
}
