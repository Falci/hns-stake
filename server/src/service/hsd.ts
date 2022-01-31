const { hd, Address } = require('hsd');

const getNetwork = (key: string) =>
  ({ x: 'main', t: 'testnet', r: 'regtest', s: 'simnet' }[key[0]]);

export const generateAddress = (index: number) => {
  const key = process.env.HSD_PUB_KEY!;
  const network = getNetwork(key);
  const xpub = hd.fromBase58(key);

  const { publicKey } = xpub.derive(0, false).derive(index, false);

  return Address.fromPubkey(publicKey).toString(network);
};
