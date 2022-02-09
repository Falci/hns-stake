import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import Address from './Address';

@Table({ tableName: 'accounts' })
@ObjectType()
export default class Account extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  @Field(() => ID)
  id: string;

  @Column('float')
  balance: number = 0;

  @Column('float')
  unconfirmed: number = 0;

  @HasOne(() => Address)
  address: Address;
}
