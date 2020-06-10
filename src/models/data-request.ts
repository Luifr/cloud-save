
export interface IGetDataRequest {
  id: string;
  file: string;
  context: DataContext;
  options: any; // TODO: scoreboard, limit size
}

export interface ISaveDataRequest {
  id: string;
  file: string;
  context: DataContext;
  data: any;
}

export type DataContext = 'GENERIC' | 'SCOREBOARD';

export interface IServerData {
  data: any;
  createdAt: number;
  updatedAt: number;
  lastFetchAt?: number;
  timesFetched: number;
  timesUpdated: number;
  version: number;
}

export type IGeneralServerFile = IServerFile<IGeneralServerData>;
export type IScoreBoardFile = IServerFile<IScoreBoardEntry[]>;

export interface IServerFile<T> {
  fileStats: IFileStats
  fileData: T;
}

export interface IGeneralServerData {
  [index: string]: IServerData | undefined;
}

export interface IFileStats {
  context: DataContext;

  createdAt: number;
  updatedAt: number;

  timesFetched: number;
  timesUpdated: number;
  lastFetchAt?: number;
  requestToUnexistingData: number;

  extra?: any;
  version: number;
}

export interface IScoreBoardEntry {
  id: string;
  score: number;
  createdAt: number;
  updatedAt: number;
  timesUpdated: number;
  version: number;
}
