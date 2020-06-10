import { resolve } from 'path';
import { ISaveDataRequest, IGetDataRequest, IServerData, IServerFile } from '../models/data-request';
import { getJsonFromFile, saveJsonToFile } from '../helpers/files';
import { appendIfNotEndsWith } from '../helpers/string';

const dataPrefix = 'data';
const version = +(process.env.SAVE_VERSION as string);

if (isNaN(version)) throw Error('Version in .env is not a number');

export function getData(dataRequest: IGetDataRequest) {
  dataRequest.file = appendIfNotEndsWith(dataRequest.file, '.json');
  const serverData = getJsonFromFile<IServerFile>(resolve(dataPrefix, dataRequest.file));

  const data = serverData[dataRequest.id];

  // TODO: timestamps
  if (data) {
    return JSON.stringify(data);
  } else {
    return ''; // TODO(feat): return default values!
  }
}

export function saveData(dataRequest: ISaveDataRequest) {
  dataRequest.file = appendIfNotEndsWith(dataRequest.file, '.json');
  const filePath = resolve(dataPrefix, dataRequest.file);

  const serverData = getJsonFromFile<IServerFile>(filePath);

  const data = serverData[dataRequest.id];

  const now = Date.now();
  let createdAt = now, lastFetchAt, timesFetched = 0;

  if (data) {
    createdAt = data.createdAt;
    lastFetchAt = data.lastFetchAt;
  }
  // TODO: timestamp conflict

  if (!dataRequest.context) {
    const newData: IServerData = {
      data: JSON.stringify(dataRequest.data),
      createdAt,
      lastFetchAt,
      timesFetched,
      updatedAt: now,
      version
    }
    serverData[dataRequest.id] = newData;
  }
  else if (dataRequest.context === 'SCOREBOARD') {
    // TODO: context (scoreboard)
  }

  saveJsonToFile(filePath, serverData);
}
