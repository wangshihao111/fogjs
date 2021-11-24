import webpack from 'webpack';
import rimraf from 'rimraf';
import { ConfigContextType } from '../context';
import { resolveEnv } from '../utils/resolveEnv';

export default function build(ctx: ConfigContextType) {
  const cwd = process.cwd();
  resolveEnv(cwd);
  process.env.NODE_ENV = 'production';
  ctx.env = 'production';
  const webpackConfig = ctx.getWebpackConfig();
  const compiler = webpack(webpackConfig);
  rimraf.sync(ctx.paths.appBuild);
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
