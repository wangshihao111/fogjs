import { dirname, resolve } from 'path';
import { ObjectType } from '../../types';

export function formatExposeFiles(
  name: string,
  files: string[],
  basePath?: string
): ObjectType<string> {
  return {
    '.': name,
    ...files
      .map((file) => {
        if (file.endsWith('index.js')) {
          return dirname(file);
        } else if (file.endsWith('.js')) {
          return file.replace(/\.js$/, '');
        } else {
          return file;
        }
      })
      .reduce(
        (value, next) => ({
          ...value,
          [`./${next}`]: resolve(basePath || '', next),
        }),
        {} as any
      ),
  };
}
