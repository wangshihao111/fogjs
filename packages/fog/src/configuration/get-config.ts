import { ConfigContextType } from '../context';
import { Configuration } from 'webpack';
import getCommonConfiguration from './get-common-config';
import { applyMfConfig } from './apply-mf-config';
import path from 'path';

export function getConfig(ctx: ConfigContextType): Configuration {
  const webpackConfig = getNormalConfig(ctx);
  if (ctx.userConfig?.mfConfig) {
    applyMfConfig(
      webpackConfig,
      ctx.userConfig.mfConfig,
      require(path.resolve(ctx.cwd, 'package.json')).name
    );
  }
  return webpackConfig;
}

export function getNormalConfig(ctx: ConfigContextType) {
  let webpackConfig = getCommonConfiguration(ctx);
  for (const configWebpack of ctx.app.configureWebpackList) {
    webpackConfig = configWebpack(webpackConfig);
  }
  return webpackConfig;
}
