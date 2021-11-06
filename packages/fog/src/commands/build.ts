import webpack from 'webpack';
import { createContext } from '../context';
import getCommonConfiguration from '../configuration/get-common-config';

export default function build() {
  const context = createContext({ env: 'production' });
  const webpackConfig = getCommonConfiguration(context);
  const compiler = webpack(webpackConfig);
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
