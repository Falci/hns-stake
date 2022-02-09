import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  logging: false,
  models: [__dirname + '/../models'],
});

let connected = false;
const connect = async () => {
  if (!connected) {
    try {
      await sequelize.authenticate();
      console.log('💾 Database connected.');
      connected = true;

      if (process.env.NODE_ENV !== 'production') {
        sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
      }
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  return sequelize;
};

export default connect;
