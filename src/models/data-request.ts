
export interface IGetDataRequest {
  id: string;
  file: string;
  context?: string;
}

export interface ISaveDataRequest {
  id: string;
  file: string;
  context?: DataContext;
  data: any;
}

export interface IServerData {
  data: any;
  createdAt: number;
  updatedAt: number;
  lastFetchAt?: number;
  timesFetched: number;
  version: number;
}

export interface IServerFile {
  [index: string]: IServerData;
}

type DataContext = 'SCOREBOARD';

export interface IScoreBoardEntry {
  id: string;
  score: string;
}
