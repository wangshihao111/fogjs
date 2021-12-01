import { ConfigContextType } from '../context';
import { Configuration } from 'webpack';
import { ObjectType } from './base.type';

export interface SharedConfig {
  eager?: boolean;
  import?: string | false;
  packageName?: string;
  requiredVersion?: string | false;
  shareKey?: string;
  shareScope?: string;
  singleton?: boolean;
  strictVersion?: boolean;
  version?: string | false;
}

interface SharedObject {
  [index: string]: string | SharedConfig;
}

export interface RemotesConfig {
  external: string | string[];
  shareScope?: string;
}

export interface RemotesObject {
  [index: string]: string | RemotesConfig | string[];
}

export type CommandFn = (
  args: ObjectType,
  ctx: ConfigContextType
) => void | Promise<void>;

export type HookFn = (
  name: string,
  ctx: ConfigContextType
) => void | Promise<void>;

export type ConfigHookKeys = 'onCommand' | 'onAfterCommand';

export type ConfigHooks = Record<ConfigHookKeys, HookFn>;

export type MfConfigType =
  | {
      mode: 'auto';
      env?: 'development' | 'production';
      cacheDirectory?: string;
      servePort?: number;
      caches: Array<{
        name: string;
        files?: string[];
      }>;
    }
  | {
      name?: string;
      mode?: 'manual';
      shared?: (string | SharedObject)[] | SharedObject;
      remotes?: (string | RemotesObject)[] | RemotesObject;
      exposes?: ObjectType<string>;
    };

export interface Config {
  define?: ObjectType;
  extends?: Config[];
  polyfill?: boolean;
  configWebpack?(config: Configuration): Configuration;
  commands?: ObjectType<CommandFn>;
  hooks?: ConfigHooks;
  mfConfig?: MfConfigType;
}
