import { ContextFunction } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import authChecker from 'middleware/authChecker';
import { AuthResolver } from 'resolvers/AuthResolver';
import { SettingsResolver } from 'resolvers/SettingsResolver';
import { WalletResolver } from 'resolvers/WalletResolver';
import { buildSchema } from 'type-graphql';

const schema = buildSchema({
  resolvers: [AuthResolver, SettingsResolver, WalletResolver],
  authChecker,
  emitSchemaFile: 'schema.graphql',
});

export default async (app: Express) => {
  const context: ContextFunction = ({ req }) => ({
    auth: AuthResolver.parseToken(req.headers?.authorization),
  });

  const server = new ApolloServer({
    context,
    schema: await schema,
    introspection: process.env.NODE_ENV !== 'production',
  });
  await server
    .start()
    .then(() =>
      console.log(`🅰️  Apollo Server running (${server.graphqlPath})`)
    );

  server.applyMiddleware({ app });
};
