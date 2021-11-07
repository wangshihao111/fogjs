'use strict';
import { Configuration } from 'webpack-dev-server';
import { ConfigContextType } from '../../context';

const host = process.env.HOST || '0.0.0.0';

export function getServerConfig(ctx: ConfigContextType): Configuration {
  const { paths } = ctx;
  return {
    compress: true,
    hot: true,
    host,
    port: 3000,
    client: {
      logging: 'error',
      overlay: { errors: true },
      progress: true,
    },
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
  };
}
