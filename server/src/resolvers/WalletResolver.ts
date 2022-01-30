import Account from 'models/Account';
import {
  Authorized,
  Ctx,
  Field,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

@ObjectType()
class Wallet {
  @Field(() => String)
  address: string;

  @Field(() => Number)
  balance: number;
}

@Resolver()
export class WalletResolver {
  @Authorized()
  @Query(() => Wallet)
  async wallet(@Ctx('auth') { id }: Account) {
    const account = await Account.findOne({ where: { id } });

    if (!account) {
      throw new Error('Account not found');
    }

    return {
      address: account.address,
      balance: account.balance,
    };
  }
}
