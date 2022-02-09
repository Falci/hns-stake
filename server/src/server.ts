import Express from 'express';
import apolloServer from './service/apolloServer';
import connect from './db/connect';

const app = Express();

apolloServer(app);

connect().then((sequelize) => {
  app.set('sequelize', sequelize);
  app.listen(3000, () => console.log('⚡️ Express server running...'));
});
