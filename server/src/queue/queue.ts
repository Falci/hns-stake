import Queue from 'bull';

export const queue = new Queue('hsd');
console.log('🐂 Queue initialized');

const { client } = queue;
const LAST_HEIGHT = 'lastHeight';

export const getLastHeight = async () =>
  client.get(LAST_HEIGHT).then((height) => parseInt(height || ''));

export const setLastHeight = async (height: number) =>
  client.set(LAST_HEIGHT, height);
