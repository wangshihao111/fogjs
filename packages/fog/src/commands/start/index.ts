import rimraf from 'rimraf';
import { createContext } from '../../context';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getServerConfig } from './getServevrConfig';
import { resolveEnv } from '../../utils/resolveEnv';
import { getConfig } from '../../configuration/get-config';
import { loadConfig } from '../../utils/loadConfig';

export default function start() {
  const cwd = process.cwd();
  resolveEnv(cwd);
  process.env.NODE_ENV = 'development';
  const context = createContext({ env: 'development' });
  context.userConfig = loadConfig();
  const webpackConfig = getConfig(context);
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
