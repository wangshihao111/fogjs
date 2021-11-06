import { RuleSetRule } from 'webpack';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ConfigContextType } from '../context';

export function getCssRules(ctx: ConfigContextType): RuleSetRule[] {
  const { env, paths } = ctx;
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const shouldUseSourceMap = env === 'development';

  const getStyleLoaders = (cssOptions: any, preProcessor?: string) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        // options: paths.publicUrlOrPath.startsWith('.')
        //   ? { publicPath: '../../' }
        //   : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            // postcssNormalize(),
          ],
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean) as any[];
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

  const modulesOpts = {
    getLocalIdent: getCSSModuleLocalIdent,
  };

  return [
    {
      test: /\.css$/,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      }),
    },
    {
      test: /\.css$/,
      resourceQuery: 'module',
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        modules: modulesOpts,
      }),
    },
    {
      test: /\.less$/,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
        'less-loader'
      ),
    },
    {
      test: /\.less$/,
      resourceQuery: 'module',
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: modulesOpts,
        },
        'less-loader'
      ),
    },
    {
      test: /\.s(a|c)ss$/,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
        'sass-loader'
      ),
    },
    {
      test: /\.s(a|c)ss$/,
      resourceQuery: 'module',
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          modules: modulesOpts,
        },
        'sass-loader'
      ),
    },
  ];
}

// @ts-ignore
function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
  return localIdentName;
}
