import { LoginSession } from 'graphql/schema';
import { useSessionStorage } from 'react-use';

export const useSession = () =>
  useSessionStorage<LoginSession | undefined>('auth');
