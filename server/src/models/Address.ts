import { generateAddress } from 'service/hsd';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import Account from './Account';
import TxMaturing from './TxMaturing';

@Entity('address')
@ObjectType()
export default class Address extends BaseEntity {
  @Field()
  @PrimaryColumn()
  address: string;

  @Column('int4')
  index: number;

  @Field(() => Account)
  @ManyToOne(() => Account, (acc) => acc.address)
  account: Account;

  @Field()
  @Column()
  used: boolean = false;

  @OneToMany(() => TxMaturing, (tx) => tx.address)
  maturing: TxMaturing[];

  static async generateNext(account: Account): Promise<Address> {
    const lastAddr = await Address.findOne({ order: { index: 'DESC' } });
    const nextIndex = (lastAddr?.index || 0) + 1;

    const addr = Address.create({
      account,
      index: nextIndex,
      address: generateAddress(nextIndex),
    });

    return await addr.save();
  }
}
