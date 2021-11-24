import { ConfigContextType } from '../context';
import { Configuration } from 'webpack';
import getCommonConfiguration from './get-common-config';

export function getConfig(ctx: ConfigContextType): Configuration {
  let webpackConfig = getCommonConfiguration(ctx);
  for (const configWebpack of ctx.app.configureWebpackList) {
    webpackConfig = configWebpack(webpackConfig);
  }
  return webpackConfig;
}
