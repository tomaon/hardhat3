import type { Address, Hash } from "viem";

export type Input = {
  cmd: "start" | "stop";
};

export type Output<T> =
  | {
      kind: "t";
      result: T;
    }
  | {
      kind: "f";
      message: string;
    };

export interface BlockData {
  number: string;
  timestamp: number;
  miner: Address;
  transactionCount: number;
  contractCount: number;
}

export type BlocksData = BlockData[];

export interface TransactionData {
  hash: Hash;
  timestamp: number;
  from: Address;
  to: Address | null;
  value: string;
}

export type TransactionsData = TransactionData[];
