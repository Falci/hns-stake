import {
  AfterInsert,
  AfterRemove,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  MoreThanOrEqual,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Address from './Address';

/**
 * This is a confirmed TX after the maturing period (unlikely to sofer reorg)
 */
@Entity('tx')
export default class Tx extends BaseEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @AfterInsert()
  async updateUnconfirmedBalance() {
    // find the account by the addr
    const { account } = await Address.findOneOrFail({
      where: { address: this.address.address },
      relations: ['account'],
    });

    account.balance += this.value;
    await account.save();
  }
}
