import {
  AfterInsert,
  AfterRemove,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  InsertEvent,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Address from './Address';

/**
 * This is a confirmed TX to an address in our database.
 * These entities lives while the TX has too low confirmations and could be affected by a reorg.
 */
@Entity('tx_maturing')
export default class TxMaturing extends BaseEntity {
  @PrimaryColumn('char', { length: 64 })
  tx: string;

  @PrimaryColumn()
  index: number;

  @ManyToOne(() => Address, (addr) => addr.maturing)
  @JoinColumn({ name: 'address' })
  address: Address;

  @Column('float4')
  value: number;

  @Column({ default: -1 })
  height: number;

  @Column({ default: -1 })
  goodAfter: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  @AfterRemove()
  async updateUnconfirmedBalance() {
    // find the account by the addr
    const addr = await Address.findOne({
      where: { address: this.address.address },
      relations: ['account'],
    });

    // hate ts
    if (!addr) {
      throw new Error(`Couldn't find the account`);
    }

    const { account } = addr;

    // sum all TxMaturing in this account (via addr)
    const { total } = await Address.createQueryBuilder('addr')
      .select('SUM(tx.value)', 'total')
      .innerJoin('addr.maturing', 'tx')
      .where('addr.account=:account', { account: account?.id })
      .getRawOne();

    account.unconfirmed = total;
    await account.save();
  }
}
