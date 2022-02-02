import Debug from 'debug';
import Settings from 'models/Settings';
import { client } from './service/hsd';

import ChainEntry from 'hsd/lib/blockchain/chainentry';
import TX from 'hsd/lib/primitives/tx';

import memPoolSub from 'subscribers/MemPoolSubscribe';
import blockSubscribe from 'subscribers/BlockSubscribe';

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

client.bind('chain connect', async (raw: any) => {
  const { height } = ChainEntry.fromRaw(raw);
  debug(`New block: ${height}`);

  thread('Settings', async () => {
    await Settings.setCurrentHeight(height);
  });

  const options = [height, 1, 1];
  const block = (await client.execute('getblockbyheight', options)) as Block;

  blockSubscribe.onBlock(block);
});

client.bind('tx', (raw: any) => {
  const tx = TX.fromRaw(raw);
  debug(`New mempool: ${tx.hash().toString('hex')}`);
  memPoolSub.onTX(tx);
});
