import ChainEntry from 'hsd/lib/blockchain/chainentry';
import TX from 'hsd/lib/primitives/tx';
import Block from 'hsd/lib/blockchain/chainentry';
import { client, getCurrentHeight, getBlock } from '../service/hsd';
import { Block as BlockQ, Tx as TxQ } from 'queue/types';
import { queue, getLastHeight, setLastHeight } from './queue';

type OutputWithCovenant = {
  covenant: {
    type: number;
  };
};
const byCovenantNone = ({ covenant }: OutputWithCovenant) =>
  covenant.type === 0;

const onBlock = async (block: Block) => {
  const { tx } = block;

  const txs = tx
    .map((tx) => ({
      ...tx,
      vout: tx.vout
        .map((out, index) => ({
          // fist, add the index to each output
          n: index,
          // value is a float, in HNS
          value: out.value,
          covenant: out.covenant,
          // standardize the address: from now on it's a string
          address: out.address.string,
        }))
        // then, get only the NONEs (covenant 0)
        .filter(byCovenantNone),
    }))
    // then, filter out tx withouth outputs
    .filter((tx) => tx.vout.length > 0);

  // last, get a light version, with only a few properties
  const light: BlockQ = {
    hash: block.hash,
    height: block.height,
    tx: txs.map((tx) => ({
      hash: tx.hash,
      txid: tx.txid,
      outputs: tx.vout.map((out) => ({
        address: out.address,
        covenant: out.covenant,
        value: out.value,
        n: out.n,
      })),
    })),
  };

  // Remove TXs from mempoolQ
  block.tx.forEach(({ txid }) => {
    queue.removeJobs(txid);
  });

  queue.add('block', light, {
    jobId: block.hash,
    removeOnComplete: true,
  });
  await setLastHeight(block.height);
};

const onMempool = async (tx: TX) => {
  const { hash, outputs } = tx.toJSON();

  const vout = outputs
    .map((out, index) => ({
      // fist, add the index to each output
      n: index,
      // address is already a string
      address: out.address,
      covenant: out.covenant,
      // value is an integer, in dollarydoos. Let's convert to HNS
      value: out.value / 1e6,
    }))
    // then, get only the NONEs (covenant 0)
    .filter(byCovenantNone);

  // if there's no outouts, abort
  if (vout.length === 0) {
    return;
  }

  // last, get a light version, with only a few properties
  const light: TxQ = {
    txid: hash,
    outputs: vout,
  };

  queue.add('mempool', light, {
    jobId: hash,
    removeOnComplete: true,
  });
};

// Check if we miss some blocks
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
  await onInit();
  await client.open().then(() => console.log('🤝 Connected to Handshake Node'));
  return () => client.close();
})();

client.bind('chain connect', async (raw: any) => {
  const { height } = ChainEntry.fromRaw(raw);
  onBlock(await getBlock(height));
});

client.bind('tx', (raw: any) => {
  const tx = TX.fromRaw(raw);
  onMempool(tx);
});
