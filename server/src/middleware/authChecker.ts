import { AuthChecker } from 'type-graphql';
interface Context {
  auth?: any;
}

const authChecker: AuthChecker<Context> = ({ context: { auth } }) => !!auth;

export default authChecker;
