import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  LessThanOrEqual,
  ManyToOne,
  MoreThan,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Address from './Address';
import Tx from './Tx';

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

  static async mature(height: number) {
    const mature = await TxMaturing.find({
      where: { goodAfter: LessThanOrEqual(height), height: MoreThan(-1) },
      relations: ['address'],
    });

    mature.forEach(async (tx) => {
      await Tx.create({
        tx: tx.tx,
        index: tx.index,
        address: tx.address,
        value: tx.value,
        height: tx.height,
      }).save();
      await tx.remove();
    });
  }
}
