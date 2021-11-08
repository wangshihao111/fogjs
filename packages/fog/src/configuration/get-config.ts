import { ConfigContextType } from '../context';
import { Configuration } from 'webpack';
import getCommonConfiguration from './get-common-config';

export function getConfig(ctx: ConfigContextType): Configuration {
  let webpackConfig = getCommonConfiguration(ctx);
  console.log(ctx.userConfig);
  if (ctx.userConfig?.configWebpack) {
    webpackConfig = ctx.userConfig?.configWebpack(webpackConfig);
  }
  return webpackConfig;
}
