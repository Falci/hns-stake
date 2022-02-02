import TX from 'hsd/lib/primitives/tx';
import Address from 'models/Address';
import TxMempool from 'models/TxMempool';

export class MemPoolSubscribe {
  onTX(tx: TX) {
    tx.outputs
      .filter(({ covenant }) => covenant.isNone())
      .forEach(async (output, index) => {
        const address = await Address.findOne({
          where: { address: output.address.toString() },
        });

        if (address) {
          await TxMempool.create({
            tx: tx.hash().toString('hex'),
            index,
            value: output.value / 1e6,
            address,
          }).save();
        }
      });
  }
}

export default new MemPoolSubscribe();
