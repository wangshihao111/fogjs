import { WebpackPluginInstance, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WebpackBar from 'webpackbar';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { ConfigContextType } from '../context';
import { resolveClientEnv } from '../utils/resolveEnv';

export function getWebpackPlugins(
  ctx: ConfigContextType
): WebpackPluginInstance[] {
  const { env, paths } = ctx;
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  return [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      ...(isEnvProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : {}),
    }),
    isEnvDevelopment && new CaseSensitivePathsPlugin(),
    new WebpackBar(),
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    isEnvProduction &&
      new WebpackManifestPlugin({ fileName: 'asset-manifest.json' }),
    new DefinePlugin(resolveClientEnv(ctx.userConfig?.define)),
    new VueLoaderPlugin() as any,
  ].filter(Boolean);
}
