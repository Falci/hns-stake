export type Block = {
  hash: string;
  height: number;
  tx: Tx[];
};

/**
 * Hash and TxID:
 * Mempool transaction has a hash and txid and they are equal
 * Once confirmed, the transaction changes (witness) and so the hash changes
 * The TxID is the old hash
 */
export type Tx = {
  txid: string;
  outputs: {
    address: string; // always a string
    covenant: {
      action: string;
      items: any[];
      type: number;
    };
    value: number; // in HNS
    n?: number;
  }[];
};
