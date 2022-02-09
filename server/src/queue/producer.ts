import conn from 'db/connect';
import ChainEntry from 'hsd/lib/blockchain/chainentry';
import TX from 'hsd/lib/primitives/tx';
import Block from 'hsd/lib/blockchain/chainentry';
import { client, getCurrentHeight, getBlock } from '../service/hsd';
import { Block as BlockQ, Tx as TxQ } from 'queue/types';
import { mempoolQ, blockQ, getLastHeight, setLastHeight } from './queue';

const onBlock = async (block: Block) => {
  const light: BlockQ = {
    hash: block.hash,
    height: block.height,
    tx: block.tx.map((tx) => ({
      hash: tx.hash,
      txid: tx.txid,
      outputs: tx.vout.map((out) => ({
        address: out.address.string,
        covenant: out.covenant,
        value: out.value,
        n: out.n,
      })),
    })),
  };

  // Remove TXs from mempoolQ
  block.tx.forEach(({ txid }) => {
    mempoolQ.removeJobs(txid);
  });

  blockQ.add(`Block #${block.height}`, light, {
    jobId: block.hash,
    removeOnComplete: true,
  });
  await setLastHeight(block.height);
};

const onMempool = async (tx: TX) => {
  const { hash, outputs } = tx.toJSON();

  const light: TxQ = {
    hash: hash,
    txid: hash,
    outputs: outputs.map((out, index) => ({
      address: out.address,
      covenant: out.covenant,
      value: out.value,
      n: index,
    })),
  };

  mempoolQ.add(hash, light, {
    jobId: hash,
    removeOnComplete: true,
  });
};

const onInit = async (): Promise<void> => {
  const lastHeight = await getLastHeight();

  if (!lastHeight) {
    return;
  }

  const currentHeight = await getCurrentHeight();

  for (let height = lastHeight + 1; height <= currentHeight; height++) {
    const block = await getBlock(height);
    await onBlock(block);
  }

  if (lastHeight !== currentHeight) {
    console.log(`${currentHeight - lastHeight} blocks sync'ed`);
    // if there was too much blocks to update, it's possible that new blocks appeared
    // during the catch up process.
    return onInit();
  }

  return;
};

(async () => {
  // prettier-ignore
  await Promise.all([
    conn(),
    onInit(), 
  ]);
  await client.open().then(() => console.log('🤝 Connected to Handshake Node'));
  return () => client.close();
})();

client.bind('chain connect', async (raw: any) => {
  const { height } = ChainEntry.fromRaw(raw);
  // TODO: check toJSON
  onBlock(await getBlock(height));
});

client.bind('tx', (raw: any) => {
  const tx = TX.fromRaw(raw);
  onMempool(tx);
});
