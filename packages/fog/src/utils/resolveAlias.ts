import path from 'path';
import { ObjectType } from '../types/base.type';

export function resolveAlias(src: string): ObjectType<string> {
  return {
    '@': path.resolve(src),
  };
}
