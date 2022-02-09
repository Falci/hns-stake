export type Block = {
  hash: string;
  height: number;
  tx: Tx[];
};

export type Tx = {
  hash: string;
  txid: string;
  outputs: {
    address: string;
    covenant: {
      action: string;
      items: any[];
      type: number;
    };
    value: number;
    n?: number;
  }[];
};
