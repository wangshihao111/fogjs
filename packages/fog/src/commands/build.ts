import webpack from 'webpack';
import rimraf from 'rimraf';
import { createContext } from '../context';
import { resolveEnv } from '../utils/resolveEnv';
import { loadConfig } from '../utils/loadConfig';
import { getConfig } from '../configuration/get-config';

export default function build() {
  const cwd = process.cwd();
  resolveEnv(cwd);
  process.env.NODE_ENV = 'production';
  const context = createContext({ env: 'production', cwd });
  context.userConfig = loadConfig();
  const webpackConfig = getConfig(context);
  const compiler = webpack(webpackConfig);
  rimraf.sync(context.paths.appBuild);
  compiler.run((err, stats) => {
    if (err) {
      throw err;
    }
    if (stats?.hasErrors()) {
      console.error(stats.toString('errors-only'));
    } else {
      console.log(stats?.toString());
    }
  });
}
