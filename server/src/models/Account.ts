import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
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
