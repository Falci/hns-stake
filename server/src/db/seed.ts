#!/usr/bin/env ts-node

import conn from 'db/connect';
import Account from 'models/Account';
import Address from 'models/Address';
import Auth from 'models/Auth';
import Settings from 'models/Settings';
import Tx from 'models/Tx';
import TxMaturing from 'models/TxMaturing';

(async () => {
  const sequelize = await conn();

  await sequelize.sync({ force: true });

  console.log('Cleaning db...');
  await TxMaturing.destroy({ where: {} });
  await Tx.destroy({ where: {} });
  await Address.destroy({ where: {} });
  await Auth.destroy({ where: {} });
  await Account.destroy({ where: {} });

  await Auth.sync({ force: true });

  console.log('Settings');
  await Settings.setCurrentHeight(0);

  console.log('Account');
  const account = await Account.create({
    id: '1872dd7c-ebe0-4367-b07a-eb7903eb1b0e',
  });

  console.log('Auth');
  await Auth.create({
    accountId: account.id,
    provider: 'local',
    providerId: 'director@handshake.org',
    token: Auth.hashPassword('123123123'),
  });

  console.log('Address');
  await Address.create({
    accountId: account.id,
    index: 1,
    address: 'rs1qllc026n0y7xdj5sy62quswrwg3wnn6ksu9xqxq',
  });

  console.log('Done!');
})().catch((e) =>
  console.log(e, {
    error: e.detail,
    query: e.query,
    params: e.params,
  })
);
