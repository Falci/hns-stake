class Address {
  toString(network?: string): string;
  static fromPubkey(key: string): Address;
}

class Block {
  height: number;
  confirmations: number;
  difficulty: number;
  hash: string;
  tx: {
    hash: string;
    txid: string;
    vin: {
      coinbase: boolean;
      txid: string;
      vout: number;
    }[];
    vout: {
      address: {
        string: string;
      };
      covenant: {
        action: 'NONE';
        items: any[];
        type: number;
      };
      value: number;
      n?: number;
    }[];
  }[];
  static fromRaw(raw: Buufer): Block;
}

class Covenant {
  isKnown(): boolean;
  isUnknown(): boolean;
  isNone(): boolean;
  isClaim(): boolean;
  isOpen(): boolean;
  isBid(): boolean;
  isReveal(): boolean;
  isRedeem(): boolean;
  isRegister(): boolean;
  isUpdate(): boolean;
  isRenew(): boolean;
  isTransfer(): boolean;
  isFinalize(): boolean;
  isRevoke(): boolean;
  isName(): boolean;
}

class Input {
  address: Address;
  prevout: Output;
  witness: Witness;
  sequence: number;
  coin: null;
}
class Output {
  value: number;
  address: Address;
  covenant: Covenant;
}

class TX {
  hash: () => Buffer;
  txid: () => Buffer;
  mutable: boolean;
  version: number;
  inputs: Input[];
  outputs: Output[];
  locktime: number;

  toJSON(): TXJSON;

  static fromRaw(raw: Buffer): TX;
}
interface TXJSON {
  hash: string;
  outputs: {
    address: string;
    covenant: {
      action: string;
      items: any[];
      type: number;
    };
    value: number;
  }[];
}

class Network {
  rpcPort: number;
  type: string;

  static get(): Network;
}

declare module 'bfilter/lib/bloom' {
  class BloomFilter {
    constructor();
    encode(): Buffer;
  }

  export = BloomFilter;
}
declare module 'hs-client' {
  class NodeClient {
    constructor(options: { port: number; apiKey: string });

    bind(event: string, fn: (raw: Buffer) => void): void;
    open();
    close();
    on(event: string, callback: (e?: any) => void): void;
    setFilter(filter: Buffer);
    execute(method: string, params?: any);
    getInfo(): Promise<{
      chain: {
        height: number;
      };
    }>;
  }
}

declare module 'hsd/lib/blockchain/chainentry' {
  export = Block;
}

declare module 'hsd/lib/hd' {
  class XPub {
    derive: (index: number, hard: boolean) => XPub;
    publicKey: string;
    static fromBase58(key: string): XPub;
  }
  export = XPub;
}
declare module 'hsd/lib/primitives/address' {
  export = Address;
}

declare module 'hsd/lib/primitives/tx' {
  export = TX;
}

declare module 'hsd/lib/protocol/network' {
  export = Network;
}
