import { resolve, dirname } from 'path';
import { getNormalConfig } from '../../configuration';
import { applyMfConfig } from '../../configuration/apply-mf-config';
import { Configuration } from 'webpack';
import globby from 'globby';
import { ConfigContextType } from '../../context';
import { formatExposeFiles } from '../../utils/mf';
import compile from '../../utils/compile/compile';
import { existsSync } from 'fs';

const getDepPath = (name: string) =>
  dirname(require.resolve(`${name}/package.json`));

function getDefaultFiles(name: string) {
  const dir = getDepPath(name);
  const pattern = '**/*.*';
  if (name === 'react-dom') {
    return ['index.js'];
  }
  return globby.sync([pattern], { cwd: dir }).filter((f) => !f.endsWith('md'));
}

function depHasCached(path: string) {
  return existsSync(path) && existsSync(resolve(path, 'remoteEntry.js'));
}

export async function autoCache(ctx: ConfigContextType) {
  if (
    ctx.userConfig &&
    ctx.userConfig.mfConfig &&
    ctx.userConfig.mfConfig.mode === 'auto'
  ) {
    const defaultCacheDirectory = resolve(ctx.cwd, 'cache');
    const {
      mfConfig: { caches, cacheDirectory = defaultCacheDirectory },
    } = ctx.userConfig;
    const cached: string[] = [];
    // 构建cache
    for (const dep of caches) {
      const outputPath = resolve(cacheDirectory, dep.name);
      if (!depHasCached(outputPath)) {
        const webpackConfig = getNormalConfig(ctx);
        Object.assign<Configuration, Configuration>(webpackConfig, {
          entry: resolve(__dirname, './cache-entry'),
          output: { path: outputPath, publicPath: 'auto' },
          cache: false,
        });
        applyMfConfig(
          webpackConfig,
          {
            mode: 'manual',
            exposes: formatExposeFiles(
              dep.name,
              dep.files || getDefaultFiles(dep.name),
              getDepPath(dep.name)
            ),
          },
          dep.name
        );
        try {
          await compile(webpackConfig, {
            outputPath,
          });
        } catch (error) {
          console.log('Cache build error:', error);
          process.exit(1);
        }
      }
      cached.push(dep.name);
    }
    ctx.state.cached = cached;
  }
}
