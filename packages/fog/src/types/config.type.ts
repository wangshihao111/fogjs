import { Configuration } from 'webpack';
import { ObjectType } from './base.type';

export interface Config {
  define?: ObjectType;
  polyfill?: boolean;
  configWebpack?(config: Configuration): Configuration;
}
