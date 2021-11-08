import { accessSync } from 'fs';

export function findFileWithExt(
  filename: string,
  extensions: string[] = ['.js', '.ts']
) {
  for (const ext of extensions) {
    try {
      const file = `${filename}${ext}`;
      accessSync(file);
      return { file, ext };
    } catch (error) {
      continue;
    }
  }
}

export function winPath(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
}
