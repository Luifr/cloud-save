import { getGenericData, saveGenericData, saveScoreBoard, getScoreBoardFile } from '../services/files';
import { ISaveDataRequest, IGetDataRequest } from '../models/data-request';
import { cleanContext } from '../helpers/context';

import * as express from 'express';

export const getData = (req: express.Request, res: express.Response) => {
  const params = req.params as any as IGetDataRequest;
  params.context = cleanContext(req.query.context);

  if (params.context === 'GENERIC') res.json(getGenericData(params));
  if (params.context === 'SCOREBOARD') res.json(getScoreBoardFile(params.file));
  else res.status(400).send(`Context ${req.query.context} does not exists`);
};

export const saveData = (req: express.Request, res: express.Response) => {
  const body: Partial<ISaveDataRequest> = req.body;

  if (body.id === undefined || body.file === undefined || body.data === undefined) {
    res.status(400).send('Missing parameters');
    return;
  }

  try {
    body.context = cleanContext(req.query.context);

    if (body.context === 'GENERIC') saveGenericData(body as ISaveDataRequest);
    else if (body.context === 'SCOREBOARD') saveScoreBoard(body as ISaveDataRequest);
    else res.status(400).send(`Context ${req.query.context} does not exists`);

    res.send('Dados salvos');
  }
  catch (error) {
    res.status(400).send(error);
  }
};