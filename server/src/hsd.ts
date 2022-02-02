import Debug from 'debug';
import Settings from 'models/Settings';
import { client } from './service/hsd';

import ChainEntry from 'hsd/lib/blockchain/chainentry';
import TX from 'hsd/lib/primitives/tx';

import memPoolSub from 'subscribers/MemPool';

import conn from 'db/connect';

const debug = Debug('server:ws');

(async () => {
  await conn;
  await client.open().then(() => console.log('🤝 Connected to Handshake Node'));
  return () => client.close();
})();

const thread = async (title: string, fn: () => Promise<void>) => {
  try {
    await fn();
  } catch (e) {
    debug(title);
    debug(e);
  }
};

client.bind('chain connect', (raw: any) => {
  const { height } = ChainEntry.fromRaw(raw);
  debug(`New block: ${height}`);

  thread('Settings', async () => {
    await Settings.setCurrentHeight(height);
  });
});

client.bind('tx', (raw: any) => {
  const tx = TX.fromRaw(raw);
  memPoolSub.onTX(tx);
});
