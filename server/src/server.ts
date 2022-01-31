import 'reflect-metadata';
import Express from 'express';
import apolloServer from './service/apolloServer';
import './db/connect';

const app = Express();
apolloServer(app);

app.listen(3000, () => console.log('⚡️ Express server running...'));
