import Account from 'models/Account';
import Address from 'models/Address';
import BalanceMemPool from 'models/BalanceMempool';
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

  @Field()
  mempool?: number;
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

    const mempool = await BalanceMemPool.createQueryBuilder('mempool')
      .innerJoin('mempool.address', 'addr')
      .where('addr.account=:id', { id })
      .select('SUM(mempool.value)', 'sum')
      .getRawOne();

    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.address) {
      account.address = await Address.generateNext(account);
    }

    return {
      address: account.address.address,
      balance: account.balance,
      mempool: mempool.sum,
    };
  }
}
