import Debug from 'debug';
import Settings from 'models/Settings';
import { client } from './service/hsd';

import ChainEntry from 'hsd/lib/blockchain/chainentry';
import TX from 'hsd/lib/primitives/tx';

const debug = Debug('server:ws');

(async () => {
  await client.open();
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
  thread('Charge.TX', async () =>
    console.log(`do something with mempool tx`, tx)
  );
});
