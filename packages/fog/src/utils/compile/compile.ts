import webpack, { Configuration } from 'webpack';
import rimraf from 'rimraf';

export default async function compile(
  config: Configuration,
  opts: { outputPath: string }
) {
  const oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const compiler = webpack(config);
  rimraf.sync(opts.outputPath);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      process.env.NODE_ENV = oldEnv;
      if (err) {
        reject(err);
      }
      if (stats?.hasErrors()) {
        reject(stats.toString('errors-only'));
      } else {
        resolve(stats?.toJson());
      }
    });
  });
}
