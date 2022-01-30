import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql';
import jwt from 'jsonwebtoken';
import Auth from 'models/Auth';
import Account from 'models/Account';

@ObjectType()
class LoginSession {
  @Field(() => Account)
  account: Account;

  @Field(() => String)
  token: string;

  constructor(auth: Auth) {
    this.account = auth.account;

    const data = {
      account: {
        id: auth.account.id,
      },
    };

    this.token = jwt.sign(data, process.env.AUTH_TOKEN_SECRET!);
  }
}

@Resolver()
export class AuthResolver {
  @Query(() => LoginSession)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    const auth = await Auth.findOne({
      where: { provider: 'local', providerId: email },
      relations: ['account'],
    });

    if (!auth || !(await auth.validatePassword(password))) {
      throw new Error('Login failed');
    }

    return new LoginSession(auth);
  }

  static parseToken(token: string | undefined) {
    try {
      // TODO: return a account from DB
      const { account } = jwt.verify(token, process.env.AUTH_TOKEN_SECRET) as {
        account: Account;
      };

      return account;
    } catch (e) {
      return null;
    }
  }
}
