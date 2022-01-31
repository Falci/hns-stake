#!/usr/bin/env ts-node

import Account from 'models/Account';
import Address from 'models/Address';
import Auth from 'models/Auth';

import conn from 'db/connect';
import Settings from 'models/Settings';

(async () => {
  await conn;

  await Address.delete({});
  await Auth.delete({});
  await Account.delete({});

  await Settings.setCurrentHeight(0);

  const account = new Account();
  await account.save();

  const auth = new Auth();
  auth.account = account;
  auth.provider = 'local';
  auth.providerId = 'director@handshake.org';
  auth.token = Auth.hashPassword('123123123');
  await auth.save();

  const address = new Address();
  address.account = account;
  address.address = 'hs1qshuyulxra3pqpwr40303t8pn79232zztuk4qgz';
  address.index = 100;

  await address.save();
})().catch((e) =>
  console.log(e, {
    error: e.detail,
    query: e.query,
    params: e.params,
  })
);
