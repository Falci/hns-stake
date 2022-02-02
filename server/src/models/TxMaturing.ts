import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './Address';
import TxMempool from './TxMempool';

/**
 * This is a confirmed TX to an address in our database.
 * These entities lives while the TX has too low confirmations and could be affected by a reorg.
 */
@Entity('tx_maturing')
export default class TxMaturing extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Address, (addr) => addr.maturing)
  @JoinColumn({ name: 'address' })
  address: Address;

  @Column('char', { length: 64 })
  tx: string;

  @Column()
  index: number;

  @Column('float4')
  value: number;

  @Column()
  height: number;

  @Column()
  goodAfter: number;

  @CreateDateColumn()
  createdAt: Date;

  @AfterInsert()
  async deleteMempool() {
    return await TxMempool.delete({ tx: this.tx });
  }
}
