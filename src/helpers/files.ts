import * as fs from 'fs';
import { IServerFile } from '../models/data-request';
import { dirname } from 'path';

const createDirIfNotExists = (filePath: string) => {
  const dir = dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

export const getJsonFromFile = <T>(filePath: string): T => {
  createDirIfNotExists(filePath);
  if (!fs.existsSync(filePath)) return {} as T;
  return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))
}

export const saveJsonToFile = (filePath: string, data: IServerFile) => {
  createDirIfNotExists(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data));
}