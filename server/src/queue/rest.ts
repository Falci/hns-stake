import { Router } from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

import { mempoolQ, blockQ } from './queue';

const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullAdapter(blockQ), new BullAdapter(mempoolQ)],
  serverAdapter: serverAdapter,
});

const route = Router();
route.use('/queue', serverAdapter.getRouter());
serverAdapter.setBasePath('/queue');

export default route;
