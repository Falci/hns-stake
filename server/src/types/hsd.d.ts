declare module 'hs-client' {
  class NodeClient {
    constructor(options: { port: number; apiKey: string });

    bind(event: string, fn: (raw: Buffer) => void): void;
    open();
    close();
  }
}

declare module 'hsd/lib/blockchain/chainentry' {
  interface Block {
    height: number;
  }
  export = { fromRaw(raw: Buufer): Block; };
}

declare module 'hsd/lib/hd' {
  interface XPub {
    derive: (index: number, hard: boolean) => XPub;
    publicKey: string;
  }
  function fromBase58(key: string): XPub;
  export = { fromBase58 };
}

declare module 'hsd/lib/primitives/address' {
  interface Address {
    toString(network: string): string;
  }
  function fromPubkey(key: string): Address;

  export = { fromPubkey };
}

declare module 'hsd/lib/primitives/tx' {
  interface TX {}
  export = { fromRaw(raw: Buufer): TX; };
}

declare module 'hsd/lib/protocol/network' {
  interface Network {
    rpcPort: number;
    type: string;
  }

  export = { get(): Network; };
}
