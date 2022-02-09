import Settings from 'models/Settings';
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class SettingsResolver {
  @Query(() => Number)
  async currentHeight() {
    return await Settings.getCurrentHeight();
  }
}
