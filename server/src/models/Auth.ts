import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import Account from './Account';
import crypto from 'crypto';

@Entity('auth')
@ObjectType()
export default class Auth extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: string;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Field(() => String)
  @Column()
  provider: 'local';

  @Field(() => String)
  @Column()
  providerId: string;

  @Field(() => String)
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
