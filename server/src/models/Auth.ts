import crypto from 'crypto';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Account from './Account';

@Entity('auth')
@ObjectType()
export default class Auth extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn([{ name: 'account_id', referencedColumnName: 'id' }])
  account: Account;

  @Field()
  @Column()
  provider: 'local';

  @Field()
  @Column()
  providerId: string;

  @Field()
  @Column()
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
