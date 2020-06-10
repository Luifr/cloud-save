import { config } from 'dotenv';
config();

import express from 'express';
import { getGenericData, saveGenericData, saveScoreBoard, getScoreBoardFile } from './services/files';
import { ISaveDataRequest, IGetDataRequest, DataContext } from './models/data-request';
import { cleanContext } from './helpers/context';

const app = express();
const port = process.env.PORT;
const service = process.env.SERVICE;

if (!port || !service || !process.env.SAVE_VERSION) throw Error('Set port and service and version in the .env file, use .env.template as template');

app.use(express.json());

app.get('/data/:file/:id?', (req: express.Request, res: express.Response) => {
  const params = req.params as any as IGetDataRequest;
  params.context = cleanContext(req.query.context);

  if (params.context === 'GENERIC') res.json(getGenericData(params));
  if (params.context === 'SCOREBOARD') res.json(getScoreBoardFile(params.file));
  else res.send(`Context ${req.query.context} does not exists`).status(400);
});

app.post('/data', (req: express.Request, res: express.Response) => {
  const body: Partial<ISaveDataRequest> = req.body;

  if (body.id === undefined || body.file === undefined || body.data === undefined) {
    res.send('Missing parameters').status(400);
    return;
  }

  try {
    body.context = cleanContext(req.query.context);

    if (body.context === 'GENERIC') saveGenericData(body as ISaveDataRequest);
    else if (body.context === 'SCOREBOARD') saveScoreBoard(body as ISaveDataRequest);
    else res.send(`Context ${req.query.context} does not exists`).status(400);

    res.send('Dados salvos');
  }
  catch (error) {
    res.send(error).status(400);
  }
});

app.listen(port, () => console.log(`Serving data to ${service} on port ${port}!`));
