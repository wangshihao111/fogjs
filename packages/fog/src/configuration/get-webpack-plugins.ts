import { WebpackPluginInstance } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { ConfigContextType } from '../context';

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
    isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    isEnvProduction &&
      new WebpackManifestPlugin({ fileName: 'asset-manifest.json' }),
  ].filter(Boolean);
}
