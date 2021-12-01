import { Config } from '@fogjs/fog';

export default {
  // polyfill: true,
  configWebpack(config) {
    return config;
  },
  mfConfig: {
    mode: 'auto',
    caches: [{ name: 'react' }, { name: 'react-dom' }],
  },
} as Config;
