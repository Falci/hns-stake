import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Auth from 'models/Auth';
import Account from 'models/Account';
import Address from 'models/Address';

export default createConnection({
  namingStrategy: new SnakeNamingStrategy(),
  name: 'default',
  type: process.env.TYPEORM_CONNECTION as any,
  host: process.env.TYPEORM_HOST as string,
  port: parseInt(process.env.TYPEORM_PORT as string),
  username: process.env.TYPEORM_USERNAME as string,
  password: process.env.TYPEORM_PASSWORD as string,
  database: process.env.TYPEORM_DATABASE as string,
  entities: [Account, Auth, Address],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
}).then(() => console.log('💾 Connected to database!'));
