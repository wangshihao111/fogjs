import { ObjectType } from './types/base.type';

export interface ConfigContextType {
  entry: string;
  env: string;
  paths: ObjectType;
}

export function createContext(opts: { env: string }): ConfigContextType {
  const { env } = opts;
  return {
    entry: '',
    env,
    paths: {},
  };
}
