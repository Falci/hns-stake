import Account from 'models/Account';
import Address from 'models/Address';
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
  @Field()
  address: string;

  @Field()
  balance?: number;
}

@Resolver()
export class WalletResolver {
  @Authorized()
  @Query(() => Wallet)
  async wallet(@Ctx('auth') { id }: Account) {
    const account = await Account.createQueryBuilder('account')
      .where('account.id=:id', { id })
      .leftJoinAndMapOne('account.address', Address, 'addr', 'addr.used=false')
      .getOne();

    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.address) {
      account.address = await Address.generateNext(account);
    }

    return {
      address: account.address.address,
      balance: account.balance,
    };
  }
}
