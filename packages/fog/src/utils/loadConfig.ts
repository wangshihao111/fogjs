import path from 'path';
import { Config } from '../types/config.type';
import BabelRegister from './BabelRegister';
import { findFileWithExt } from './util';
const cwd = process.cwd();

export function loadConfig(): Config {
  const configFileName = path.resolve(cwd, 'fog.config');
  const { file: configFile } = findFileWithExt(configFileName) || ({} as any);
  const register = new BabelRegister();
  register.setOnlyMap({
    key: 'config-file',
    value: [configFile],
  });
  register.register();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config: any = {};
  try {
    config = require(configFile);
  } catch (error: any) {
    console.warn('Read configuration failed.', error?.message);
  }
  return config.default || config;
}
