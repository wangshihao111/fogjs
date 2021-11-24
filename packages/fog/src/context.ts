import { Configuration } from 'webpack';
import Application from './Application';
import { Config, ObjectType } from './types';
import { ResolvedPaths, resolvePaths } from './utils/paths';

export interface ConfigContextType {
  args?: ObjectType;
  entry: string;
  env: string;
  paths: ResolvedPaths;
  cwd: string;
  userConfig?: Config;
  app: Application;
  getWebpackConfig(): Configuration;
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
    getWebpackConfig: () => ({} as any),
  } as any;
}
