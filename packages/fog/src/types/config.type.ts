import { ConfigContextType } from '../context';
import { Configuration } from 'webpack';
import { ObjectType } from './base.type';

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

export interface Config {
  define?: ObjectType;
  extends?: Config[];
  polyfill?: boolean;
  configWebpack?(config: Configuration): Configuration;
  commands?: ObjectType<CommandFn>;
  hooks?: ConfigHooks;
}
