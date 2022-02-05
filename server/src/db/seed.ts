#!/usr/bin/env ts-node

import conn from 'db/connect';
import Account from 'models/Account';
import Address from 'models/Address';
import Auth from 'models/Auth';
import Settings from 'models/Settings';
import Tx from 'models/Tx';
import TxMaturing from 'models/TxMaturing';

(async () => {
  await conn;

  console.log('Cleaning db...');
  await TxMaturing.delete({});
  await Tx.delete({});
  await Address.delete({});
  await Auth.delete({});
  await Account.delete({});

  console.log('Settings');
  await Settings.setCurrentHeight(0);

  console.log('Account');
  const account = new Account();
  account.id = '1872dd7c-ebe0-4367-b07a-eb7903eb1b0e';
  await account.save();

  console.log('Auth');
  const auth = new Auth();
  auth.account = account;
  auth.provider = 'local';
  auth.providerId = 'director@handshake.org';
  auth.token = Auth.hashPassword('123123123');
  await auth.save();

  console.log('Address');
  const address = new Address();
  address.account = account;
  address.address = 'rs1qllc026n0y7xdj5sy62quswrwg3wnn6ksu9xqxq';
  address.index = 1;
  await address.save();

  console.log('Done!');
})().catch((e) =>
  console.log(e, {
    error: e.detail,
    query: e.query,
    params: e.params,
  })
);
