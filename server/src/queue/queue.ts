import Queue from 'bull';

export const mempoolQ = new Queue('mempool');
export const blockQ = new Queue('block');
console.log('🐂 Queue initialized');

const { client } = blockQ;
const LAST_HEIGHT = 'lastHeight';

export const getLastHeight = async () =>
  client.get(LAST_HEIGHT).then((height) => parseInt(height || ''));

export const setLastHeight = async (height: number) =>
  client.set(LAST_HEIGHT, height);
