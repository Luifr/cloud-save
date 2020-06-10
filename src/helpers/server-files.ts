import * as fs from 'fs';
import { IServerFile } from '../models/data-request';
import { dirname } from 'path';
import { DataContext } from '../models/data-request';

const version = +(process.env.SAVE_VERSION as string);

if (isNaN(version)) throw Error('Version in .env is not a number');

const createDirIfNotExists = (filePath: string) => {
  const dir = dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

const defaultValueFromContext: { [index in DataContext]: any } = {
  GENERIC: {},
  SCOREBOARD: []
};

export const rawJsonGet = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
}

export const rawJsonSave = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const getJsonFromFile = <T>(filePath: string, context: DataContext, isInternalRead = false): IServerFile<T> => {
  createDirIfNotExists(filePath);
  const now = Date.now();
  let file: IServerFile<T>;
  if (!fs.existsSync(filePath)) {
    file = {
      fileData: defaultValueFromContext[context],
      fileStats: {
        context,
        createdAt: now,
        updatedAt: now,
        lastFetchAt: isInternalRead ? undefined : now,
        timesFetched: isInternalRead ? 0 : 1,
        timesUpdated: 0,
        requestToUnexistingData: 0,
        version
      }
    };
  }
  else {
    file = rawJsonGet(filePath) as IServerFile<T>;
    if (!isInternalRead) {
      file.fileStats.lastFetchAt = now;
      file.fileStats.timesFetched++;
    }
  }

  rawJsonSave(filePath, file);
  return file;
}

export const saveJsonToFile = <T>(filePath: string, context: DataContext, data: T): void => {
  createDirIfNotExists(filePath);

  const now = Date.now();

  const fileStats = getJsonFromFile(filePath, context, true).fileStats;
  fileStats.updatedAt = now;
  fileStats.timesUpdated++;

  rawJsonSave(filePath, { fileStats, fileData: data});
}