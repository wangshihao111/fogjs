import rimraf from 'rimraf';
import { ConfigContextType } from '../../context';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getServerConfig } from './getServevrConfig';
import { resolveEnv } from '../../utils/resolveEnv';
import { autoCache } from './auto-cache';

export default async function start(context: ConfigContextType) {
  const cwd = process.cwd();
  resolveEnv(cwd);
  process.env.NODE_ENV = 'development';
  await autoCache(context);
  const webpackConfig = context.getWebpackConfig();
  const compiler: webpack.Compiler = webpack(webpackConfig);
  rimraf.sync(context.paths.appBuild);

  const server = new WebpackDevServer(
    {
      ...getServerConfig(context),
    } as any,
    compiler as any
  );

  server.start();
}
