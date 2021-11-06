import webpack from 'webpack';
import rimraf from 'rimraf';
import { createContext } from '../context';
import getCommonConfiguration from '../configuration/get-common-config';

export default function build() {
  process.env.NODE_ENV = 'production';
  const context = createContext({ env: 'production' });
  const webpackConfig = getCommonConfiguration(context);
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
