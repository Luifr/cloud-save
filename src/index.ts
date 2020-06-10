import { config } from 'dotenv';
config();

import express from 'express';
import { getData, saveData } from './services/files';
import { ISaveDataRequest, IGetDataRequest } from './models/data-request';


const app = express();
const port = process.env.PORT;
const service = process.env.SERVICE;

if (!port || !service || !process.env.SAVE_VERSION) throw Error('Set port and service and version in the .env file, use .env.template as template');

app.use(express.json());

app.get('/data/:file/:id/:context?', (req: express.Request, res: express.Response) => {
  res.send(getData(req.params as any as IGetDataRequest));
});

app.post('/data', (req: express.Request, res: express.Response) => {
  const body: Partial<ISaveDataRequest> = req.body;

  if (body.id === undefined || body.file === undefined || body.data === undefined) {
    res.send('Missing parameters').status(400);
    return;
  }

  saveData(body as ISaveDataRequest);
  res.send('Deu bom');
});

app.listen(port, () => console.log(`Serving data to ${service} on port ${port}!`));
