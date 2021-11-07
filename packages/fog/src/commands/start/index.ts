import rimraf from 'rimraf';
import getCommonConfiguration from '../../configuration/get-common-config';
import { createContext } from '../../context';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getServerConfig } from './getServevrConfig';
import { resolveEnv } from '../../utils/resolveEnv';

export default function start() {
  const cwd = process.cwd();
  resolveEnv(cwd);
  process.env.NODE_ENV = 'development';
  const context = createContext({ env: 'development' });
  const webpackConfig = getCommonConfiguration(context);
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
