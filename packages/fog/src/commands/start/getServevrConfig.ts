'use strict';
import { Configuration } from 'webpack-dev-server';
import { static as serveStatic } from 'express';
import { ConfigContextType } from '../../context';
import path from 'path';
import { defaultCacheServePath } from '../../utils';

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
      overlay: { errors: true, warnings: false },
      progress: true,
    },
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    onBeforeSetupMiddleware(server) {
      server.app.use(
        defaultCacheServePath,
        serveStatic(path.resolve(ctx.cwd, 'cache'))
      );
    },
  };
}
