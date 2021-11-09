import { ConfigContextType } from '../context';

export function resolveEntry(appIndex: string, ctx: ConfigContextType) {
  const result = [appIndex];
  const usePolyfill = ctx.userConfig?.polyfill;
  if (
    (typeof usePolyfill === 'undefined' && ctx.env === 'production') ||
    usePolyfill
  ) {
    result.push('core-js');
  }
  return result;
}
