import { config } from 'dotenv';
config();

import express from 'express';
import { router } from './routes/index';

const app = express();
const port = process.env.PORT;
const service = process.env.SERVICE;
const versions = [process.env.GENERIC_FILE_VERSION, process.env.SCOREBOARD_FILE_VERSION, process.env.FILE_STATS_VERSION];

if (!port || !service) throw Error('Set port and service in the .env file, use .env.template as template');
versions.forEach(version => {
  if (!version || isNaN(+version)) {
     throw Error('Set version for GENERIC_FILE_VERSION, SCOREBOARD_FILE_VERSION and FILE_STATS_VERSION in the .env file, use .env.template as template');
  }
});

app.use(express.json());
app.use(express.text());

app.use(router);

app.listen(port, () => console.log(`Serving data to ${service} on port ${port}!`));
