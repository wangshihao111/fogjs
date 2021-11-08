import { Configuration } from 'webpack';
import { ObjectType } from './base.type';

export interface Config {
  define?: ObjectType;
  configWebpack?(config: Configuration): Configuration;
}
