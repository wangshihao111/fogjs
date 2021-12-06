import { resolve, dirname } from 'path';
import { getNormalConfig } from '../../configuration';
import { applyMfConfig } from '../../configuration/apply-mf-config';
import { Configuration } from 'webpack';
import globby from 'globby';
import { ConfigContextType } from '../../context';
import { formatExposeFiles } from '../../utils/mf';
import compile from '../../utils/compile/compile';
import { existsSync } from 'fs';
import { logger } from '../../utils';

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

export async function autoCache(
  ctx: ConfigContextType,
  opts?: { force?: boolean; name?: string }
) {
  if (
    ctx.userConfig &&
    ctx.userConfig.mfConfig &&
    ctx.userConfig.mfConfig.mode === 'auto'
  ) {
    const defaultCacheDirectory = resolve(ctx.cwd, 'cache');
    const {
      mfConfig: { caches = [], cacheDirectory = defaultCacheDirectory },
    } = ctx.userConfig;
    const buildOnePkg = async (dep: any, outputPath: string) => {
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
    };
    if (opts?.name) {
      logger.info(`Building package - ${opts.name}`);
      const dep = caches.find((c) => c.name === opts.name);
      if (!dep) {
        throw new Error(`package ${opts.name} does not exists in config.`);
      }
      await buildOnePkg(dep, resolve(cacheDirectory, opts.name));
      logger.success(`Building package - ${opts.name} successfully.\n`);
    } else {
      for (const dep of caches) {
        const outputPath = resolve(cacheDirectory, dep.name);
        if (!depHasCached(outputPath) || opts?.force) {
          logger.info(`Building package - ${dep.name}`);
          await buildOnePkg(dep, outputPath);
          logger.success(`Building package - ${dep.name} successfully\n`);
        } else {
          logger.info(`Package - ${dep.name} already built, skip it.`);
        }
      }
    }
  }
}
