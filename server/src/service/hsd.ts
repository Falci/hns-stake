import Network from 'hsd/lib/protocol/network';
import { NodeClient } from 'hs-client';
import hd from 'hsd/lib/hd';
import Address from 'hsd/lib/primitives/address';

const network = Network.get();

export const client = new NodeClient({
  port: network.rpcPort,
  apiKey: 'api-key',
});

const getNetwork = (key: string) =>
  ({ x: 'main', t: 'testnet', r: 'regtest', s: 'simnet' }[key[0]] ||
  network.type);

export const generateAddress = (index: number) => {
  const key = process.env.HSD_PUB_KEY!;
  const network = getNetwork(key);
  const xpub = hd.fromBase58(key);

  const { publicKey } = xpub.derive(0, false).derive(index, false);

  return Address.fromPubkey(publicKey).toString(network);
};
