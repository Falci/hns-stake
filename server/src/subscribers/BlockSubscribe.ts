import Address from 'models/Address';
import TxMaturing from 'models/TxMaturing';

export class BlockSubscribe {
  // TODO: this method could have some logs
  async onBlock(block: Block) {
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
      await Address.createQueryBuilder('addr')
        .where('addr.address IN (:...addresses)', { addresses })
        .getMany()
    ).reduce(
      (map, item) => ({
        ...map,
        [item.address]: item,
      }),
      {}
    ) as { [addr: string]: Address };

    const ourAddrsPlain = Object.keys(ourAddrs);

    transfers
      // get the transfer to us
      .filter(({ address }) => ourAddrsPlain.includes(address))
      // save in `tx_maturing`
      .forEach((output) => {
        TxMaturing.create({
          ...output,
          address: ourAddrs[output.address],
          height: block.height,
          goodAfter: block.height + 10, // TODO: create a better rule or use config
        }).save();
      });
  }
}

export default new BlockSubscribe();
