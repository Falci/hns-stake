import Address from 'models/Address';
import TxMaturing from 'models/TxMaturing';

export class BlockSubscribe {
  async onBlock(block: Block) {
    this.populateTxMaturing(block);

    TxMaturing.mature(block.height);
  }

  // TODO: this method could have some logs
  private async populateTxMaturing(block: Block) {
    // TX NONE from the block
    const transfers = block.tx.flatMap((t) =>
      t.vout
        .filter((out) => out.covenant.type === 0)
        .map((out) => ({
          tx: t.txid,
          index: out.n,
          address: out.address.string,
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

    transfers
      // get the transfer to us
      .filter(({ address }) => ourAddrs.includes(address))
      // save in `tx_maturing`
      .forEach((output) => {
        TxMaturing.upsert({
          ...output,
          addressId: output.address,
          height: block.height,
          goodAfter: block.height + 2, // TODO: create a better rule or use config
        });
      });
  }
}

export default new BlockSubscribe();
