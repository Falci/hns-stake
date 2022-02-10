import Address from 'models/Address';
import TxMaturing from 'models/TxMaturing';
import { queue } from './queue';
import { Tx, Block } from './types';
import connect from 'db/connect';
import Settings from 'models/Settings';

(async () => {
  await connect();

  queue.process('mempool', async (job) => {
    const tx: Tx = job.data;

    for (const output of tx.outputs) {
      try {
        await TxMaturing.create({
          tx: tx.txid,
          index: output.n,
          value: output.value,
          addressId: output.address,
        });
      } catch (e) {
        console.log(`Address ${output.address} is unknown`);
      }
    }
  });

  queue.process('block', async (job) => {
    const block: Block = job.data;

    await TxMaturing.mature(block.height);
    await Settings.setCurrentHeight(block.height);

    // TX NONE from the block
    const transfers = block.tx.flatMap((tx) =>
      tx.outputs.map((out) => ({
        tx: tx.txid,
        index: out.n,
        address: out.address,
        value: out.value,
      }))
    );

    // All addresses that received money in this block
    const addresses = transfers.map(({ address }) => address);

    // All addresses that we care
    const ourAddrs = (
      await Address.findAll({
        where: { address: addresses },
        attributes: ['address'],
      })
    ).map(({ address }) => address);

    const outputs = transfers
      // get the transfer to us
      .filter(({ address }) => ourAddrs.includes(address));

    for (const output of outputs) {
      // save in `tx_maturing`
      await TxMaturing.upsert({
        ...output,
        addressId: output.address,
        height: block.height,
        goodAfter: block.height + 2, // TODO: create a better rule or use config
      });
    }
  });
})();
