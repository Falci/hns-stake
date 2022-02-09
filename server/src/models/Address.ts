import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { generateAddress } from 'service/hsd';
import { Field, ObjectType } from 'type-graphql';
import Account from './Account';

@Table({ tableName: 'addresses' })
@ObjectType()
export default class Address extends Model {
  @Field()
  @Column({ primaryKey: true })
  address: string;

  @Column('int4')
  index: number;

  @Field(() => Account)
  @BelongsTo(() => Account)
  account: Account;

  @ForeignKey(() => Account)
  @Column({ type: DataType.UUID })
  accountId: string;

  @Field()
  @Column
  used: boolean = false;

  static async generateNext(account: Account): Promise<Address> {
    const lastAddr = await Address.findOne({
      order: [['index', 'DESC']],
      attributes: ['index'],
    });
    const nextIndex = (lastAddr?.index || 0) + 1;

    console.log({ lastAddr, nextIndex });

    return await Address.create({
      accountId: account.id,
      index: nextIndex,
      address: generateAddress(nextIndex),
    });
  }
}
