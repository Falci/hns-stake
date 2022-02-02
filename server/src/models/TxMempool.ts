import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './Address';

/**
 * This entity represets a transaction in mempool to an address in our database.
 * [These entities are removed once they are confirmed]{@link TxMaturing#deleteMempool()}
 */
@Entity('tx_mempool')
export default class TxMempool extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Address, (addr) => addr.mempool)
  @JoinColumn({ name: 'address' })
  address: Address;

  @Column('char', { length: 64 })
  tx: string;

  @Column()
  index: number;

  @Column('float4')
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
