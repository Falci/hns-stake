import Express from 'express';
import apolloServer from './service/apolloServer';
import connect from './db/connect';
import { default as queue } from './queue/rest';

const app = Express();

apolloServer(app);

if (process.env.NODE_ENV !== 'production') {
  app.use(queue);
}

connect().then((sequelize) => {
  app.set('sequelize', sequelize);
  app.listen(3000, () => console.log('⚡️ Express server running...'));
});
