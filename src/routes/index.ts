import { Router } from 'express';
import { saveData, getData } from '../controllers';

export const router = Router();

router.post('/test', (req, res)=> {console.log(req.body); res.json({d: 3, e: 11})});

router.get('/data/:file/:id?', getData);

router.post('/data', saveData);
