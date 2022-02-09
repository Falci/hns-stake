import crypto from 'crypto';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import Account from './Account';

@Table({ tableName: 'auth' })
@ObjectType()
export default class Auth extends Model {
  @AutoIncrement
  @PrimaryKey
  @Field(() => ID)
  @Column
  id: number;

  @BelongsTo(() => Account)
  account: Account;

  @ForeignKey(() => Account)
  @Column({ type: DataType.UUID })
  accountId: string;

  @Field()
  @Column
  provider: 'local';

  @Field()
  @Column
  providerId: string;

  @Field()
  @Column
  token: string;

  static hashPassword(password: string) {
    return crypto
      .createHash('sha256')
      .update(process.env.AUTH_TOKEN_SECRET!)
      .update(password)
      .digest('hex');
  }

  async validatePassword(password: string) {
    return Auth.hashPassword(password) === this.token;
  }
}
