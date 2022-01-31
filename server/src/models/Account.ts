import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './Address';

@Entity('account')
@ObjectType()
export default class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field()
  @Column('float')
  balance: number = 0;

  @OneToOne(() => Address, (addr) => addr.account)
  address: Address;
}
