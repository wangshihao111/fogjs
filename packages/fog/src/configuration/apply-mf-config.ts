import { Configuration, container } from 'webpack';
import { camelCase } from 'lodash';
// @ts-ignore
import ExternalRemotePlugin from 'external-remotes-plugin';
import { MfConfigType } from '../types';
import { writeFileSync } from 'fs';
import path from 'path';
import { defaultCacheServePath } from '../utils';

function getDepsKey(key: string) {
  return camelCase(key);
}

const generateResourceFile = (deps: any[], basePath: string) => {
  const fileContent = `
    Object.assign(window, {
      ${deps.map((d) => `${getDepsKey(d)}Url: '${basePath}/${d}',`).join('\n')}
    })
  `;
  const filePath = path.resolve(__dirname, '__resourceEntry__.js');
  writeFileSync(
    path.resolve(__dirname, '__resourceEntry__.js'),
    fileContent,
    'utf-8'
  );
  return filePath;
};

export function applyMfConfig(
  webpackConfig: Configuration,
  mfConfig: MfConfigType,
  name: string
) {
  let remotes: any;
  let shared: any;
  let exposes: any;
  if (mfConfig.mode === 'manual' || !mfConfig.mode) {
    remotes = mfConfig.remotes;
    shared = mfConfig.shared;
    exposes = mfConfig.exposes;
  } else if (mfConfig.mode === 'auto') {
    // 自动模式下，需要将资源地址加在入口配制处
    const tmpPath = generateResourceFile(
      mfConfig.caches.map((c) => c.name),
      defaultCacheServePath
    );
    (webpackConfig.entry as string[]).unshift(tmpPath);
    remotes = mfConfig.caches
      .map(({ name }) => ({
        [name]: `${getDepsKey(name)}@[window.${getDepsKey(
          name
        )}Url]/remoteEntry.js`,
      }))
      .reduce((value, next) => ({ ...value, ...next }), {});
  }
  webpackConfig.plugins &&
    webpackConfig.plugins.push(
      new container.ModuleFederationPlugin({
        filename: 'remoteEntry.js',
        name: getDepsKey(name),
        remotes,
        shared,
        exposes,
      }),
      new ExternalRemotePlugin()
    );
}
