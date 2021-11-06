import { Configuration } from 'webpack';

export interface Config {
  configWebpack(config: Configuration): Configuration;
}
