import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';
import { ObjectType } from '../types/base.type';

const nodeEnv = process.env.NODE_ENV;

export function resolveEnv(cwd: string) {
  function getOneFile(fileName: string) {
    return path.resolve(cwd, fileName);
  }
  const envFiles: string[] = [
    getOneFile('.env.local'),
    getOneFile(`.env.${nodeEnv}.local`),
    getOneFile(`.env.${nodeEnv}`),
    getOneFile('.env'),
  ];
  envFiles.forEach((file) => {
    dotenvExpand(dotenv.config({ path: file }));
  });
}

export function resolveClientEnv(userDefine?: ObjectType<string>) {
  const clientRegexp = /^FOG_/;
  const result: ObjectType<string> = {};
  const commonEnvList = ['NODE_ENV'];

  Object.entries(process.env).forEach(([key, value]) => {
    if (clientRegexp.test(key) || commonEnvList.includes(key)) {
      result[`process.env.${key}`] = JSON.stringify(value);
    }
  });

  if (userDefine) {
    Object.entries(userDefine).forEach(
      ([k, v]) => (result[k] = JSON.stringify(v))
    );
  }

  return result;
}
