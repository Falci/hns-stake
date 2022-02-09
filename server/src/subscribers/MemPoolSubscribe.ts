import TX from 'hsd/lib/primitives/tx';
import TxMaturing from 'models/TxMaturing';

export class MemPoolSubscribe {
  onTX(tx: TX) {
    this.populateTxMaturing(tx);
  }

  private populateTxMaturing(tx: TX) {
    tx.outputs
      .filter(({ covenant }) => covenant.isNone())
      .forEach(async (output, index) => {
        try {
          await TxMaturing.create({
            tx: tx.hash().toString('hex'),
            index,
            value: output.value / 1e6,
            addressId: output.address.toString(),
          });
        } catch (e) {
          console.log(`Address ${output.address.toString()} is unknown`);
        }
      });
  }
}

export default new MemPoolSubscribe();
