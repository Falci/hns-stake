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
  balance: number;

  @Field()
  unconfirmed: number;
}

@Resolver()
export class WalletResolver {
  @Authorized()
  @Query(() => Wallet)
  async wallet(@Ctx('auth') { id }: Account) {
    const account = await Account.findOne({
      where: { id },
      include: {
        required: false,
        model: Address,
        attributes: ['address'],
        where: { used: false },
      },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.address) {
      account.address = await Address.generateNext(account);
    }

    return {
      address: account.address.address,
      balance: account.balance,
      unconfirmed: account.unconfirmed,
    };
  }
}
