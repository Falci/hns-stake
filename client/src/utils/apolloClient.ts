import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({ uri: '/graphql' });

const getToken = () => {
  try {
    const raw = sessionStorage.getItem('auth');
    const auth = JSON.parse(raw!);
    return auth.token;
  } catch (e) {
    return null;
  }
};

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: getToken(),
  },
}));

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
