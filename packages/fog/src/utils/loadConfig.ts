import path from 'path';
import Application from '../Application';
import { Config, ConfigHookKeys, ConfigHooks } from '../types/config.type';
import BabelRegister from './BabelRegister';
import { findFileWithExt } from './util';
const cwd = process.cwd();

export function loadConfig(store: Application): Config {
  const configFileName = path.resolve(cwd, 'fog.config');
  const { file: configFile } = findFileWithExt(configFileName) || ({} as any);
  const register = new BabelRegister();
  register.setOnlyMap({
    key: 'config-file',
    value: [configFile],
  });

  let config: Config = {};
  try {
    const configContent = require(configFile);
    config = configContent.default || configContent;
  } catch (error: any) {
    console.warn('Read configuration failed.', error);
  }
  applyConfig(store, config);
  return config;
}

function assignHooks(store: Application, hooks: ConfigHooks) {
  Object.entries(hooks).forEach(([hook, hookFn]) => {
    store.hooks[hook as ConfigHookKeys].push(hookFn);
  });
}

function applyConfig(store: Application, config: Config) {
  if (config.extends?.length) {
    config.extends.forEach((c) => applyConfig(store, c));
  }
  store.commands = {
    ...store.commands,
    ...(config.commands || {}),
  };
  if (config.configWebpack) {
    store.configureWebpackList.push(config.configWebpack);
  }
  if (config.hooks) {
    assignHooks(store, config.hooks);
  }
}
