import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './Address';

@Entity('balance_mempool')
export default class BalanceMemPool extends BaseEntity {
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
}
