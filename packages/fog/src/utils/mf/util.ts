import fs from 'fs';
import path from 'path';

export function isMfDistExist(dep: string, directory: string) {
  try {
    const list = fs.readdirSync(path.resolve(directory, dep));
    return list.includes('remoteEntry.js');
  } catch (error) {
    return false;
  }
}
