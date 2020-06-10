import { resolve } from 'path';
import { ISaveDataRequest, IGetDataRequest, IServerData, IScoreBoardEntry, IGeneralServerFile, IGeneralServerData, IScoreBoardFile } from '../models/data-request';
import { getJsonFromFile, saveJsonToFile, rawJsonSave } from '../helpers/server-files';
import { appendIfNotEndsWith } from '../helpers/string';

// TODO: check if context match
// TODO: timestamp conflict
// TODO: check version conflict
// TODO: version update function
// TODO: check if file exists and is empty
// TODO: check if file is corrupted

// HOW: how to set .env externally (with docker)

const dataPrefix = 'data';
const version = +(process.env.SAVE_VERSION as string);

if (isNaN(version)) throw Error('Version in .env is not a number');

export const getGenericFile = (file: string): IGeneralServerFile => {
  file = appendIfNotEndsWith(file, '.json');
  return getJsonFromFile<IGeneralServerData>(resolve(dataPrefix, file), 'GENERIC');
}

export const getGenericData = (dataRequest: IGetDataRequest) => {
  const filePath = resolve(dataPrefix, appendIfNotEndsWith(dataRequest.file, '.json'));
  const serverData = getJsonFromFile<IGeneralServerData>(filePath, dataRequest.context);

  const data = serverData.fileData[dataRequest.id];

  if (data) {
    data.timesFetched++;
    data.lastFetchAt = Date.now();
    return data;
  }

  serverData.fileStats.requestToUnexistingData++;
  rawJsonSave(filePath, serverData);
  return {};

}

export const saveGenericData = (dataRequest: ISaveDataRequest) => {
  const filePath = resolve(dataPrefix, appendIfNotEndsWith(dataRequest.file, '.json'));

  const serverData = getJsonFromFile<IGeneralServerData>(filePath, dataRequest.context, true).fileData;

  const data = serverData[dataRequest.id];

  const now = Date.now();
  let createdAt = now, lastFetchAt, timesFetched = 0, timesUpdated = 1;

  if (data) {
    createdAt = data.createdAt;
    lastFetchAt = data.lastFetchAt;
    timesUpdated = data.timesUpdated+1;
  }

  const newData: IServerData = {
    data: dataRequest.data,
    createdAt,
    lastFetchAt,
    timesFetched,
    timesUpdated,
    updatedAt: now,
    version
  }
  serverData[dataRequest.id] = newData;

  saveJsonToFile(filePath, dataRequest.context, serverData);
}

export const getScoreBoardFile = (file: string): IScoreBoardFile => {
  file = appendIfNotEndsWith(file, '.json');
  const scoreBoardFile = getJsonFromFile<IScoreBoardEntry[]>(resolve(dataPrefix, file), 'SCOREBOARD');
  scoreBoardFile.fileData.sort((entryA, entryB) => entryA.score - entryB.score);
  console.log(scoreBoardFile);
  return scoreBoardFile;
}

export const saveScoreBoard = (dataRequest: ISaveDataRequest) => {
  const filePath = resolve(dataPrefix, appendIfNotEndsWith(dataRequest.file, '.json'));

  const serverData = getJsonFromFile<IScoreBoardEntry[]>(filePath, 'SCOREBOARD');

  const now = Date.now();

  const index = serverData.fileData.findIndex(entry => entry.id == dataRequest.id);

  if (index == -1) {
    const newEntry: IScoreBoardEntry = {
      id: dataRequest.id,
      score: dataRequest.data,
      createdAt: now,
      updatedAt: now,
      timesUpdated: 1,
      version
    }
    serverData.fileData.push(newEntry);
  }
  else {
    serverData.fileData[index].score = dataRequest.data;
    serverData.fileData[index].updatedAt = now;
    serverData.fileData[index].timesUpdated++;
  }

  saveJsonToFile(filePath, 'SCOREBOARD', serverData.fileData);
}
