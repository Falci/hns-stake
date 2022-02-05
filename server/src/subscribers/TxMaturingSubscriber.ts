import Address from 'models/Address';
import TxMaturing from 'models/TxMaturing';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class TxMaturingSubsscriber
  implements EntitySubscriberInterface<TxMaturing>
{
  listenTo() {
    return TxMaturing;
  }

  async afterInsert(event: InsertEvent<TxMaturing>) {
    const tx = event.entity;

    throw new Error('rollback');

    // find the account by the addr
    const { account } = await Address.findOneOrFail({
      where: { address: tx.address.address },
      relations: ['account'],
    });

    // sum all TxMaturing in this account (via addr)
    const { total } = await Address.createQueryBuilder('addr')
      .select('SUM(tx.value)', 'total')
      .innerJoin('addr.maturing', 'tx')
      .where('addr.account=:account', { account: account?.id })
      .getRawOne();

    account.unconfirmed = (total || 0) + tx.value;
    await account.save();
  }
}
