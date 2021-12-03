import { Configuration } from 'webpack';
import { ConfigContextType } from '../context';
import { resolveAlias } from '../utils/resolveAlias';
import { getCssRules } from './get-css-rules';
import { getWebpackPlugins } from './get-webpack-plugins';
import { resolveEntry } from './util';

const imageInlineSizeLimit = 8096;
const hasJsxRuntime = true;

const getCommonConfiguration = (ctx: ConfigContextType): Configuration => {
  const { env = 'development', paths } = ctx;
  const isEnvProduction = env === 'production';
  const isEnvDevelopment = env === 'development';
  const shouldUseSourceMap = env === 'development';
  return {
    entry: resolveEntry(paths.appEntry, ctx),
    mode: env === 'production' ? 'production' : 'development',
    resolve: {
      extensions: ['.js', '.ts', '.tsx', 'jsx', '.json'],
      alias: resolveAlias(paths.appSrc),
    },
    output: {
      path: isEnvProduction ? paths.appBuild : undefined,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      // devtoolModuleFilenameTemplate: isEnvProduction
      //   ? info =>
      //       path
      //         .relative(paths.appSrc, info.absoluteResourcePath)
      //         .replace(/\\/g, '/')
      //   : isEnvDevelopment &&
      //     (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      // jsonpFunction: `webpackJsonp${appPackageJson.name}`,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            // compiler: require('@vue/compiler-sfc'),
          },
        },
        {
          oneOf: [
            {
              test: [/\.avif$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                mimetype: 'image/avif',
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              resourceQuery: /vue/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: true,
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],

                plugins: [
                  '@vue/babel-plugin-jsx',
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                  [require.resolve('@umijs/babel-plugin-auto-css-modules')],
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: true,
                presets: [
                  [
                    require.resolve('babel-preset-react-app'),
                    {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],

                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                  [require.resolve('@umijs/babel-plugin-auto-css-modules')],
                  // isEnvDevelopment &&
                  //   shouldUseReactRefresh &&
                  //   require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            ...getCssRules(ctx),
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [...getWebpackPlugins(ctx)],
  };
};

export default getCommonConfiguration;
