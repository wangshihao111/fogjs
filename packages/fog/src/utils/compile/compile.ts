import webpack, { Configuration } from 'webpack';
import rimraf from 'rimraf';

export default async function compile(
  config: Configuration,
  opts: { outputPath: string }
) {
  process.env.NODE_ENV = 'production';
  const compiler = webpack(config);
  rimraf.sync(opts.outputPath);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
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
