import {
  type Address,
  BaseError,
  type Hash,
  createPublicClient,
  // http,
  webSocket,
} from "viem";
import { hardhat } from "viem/chains";

export const publicClient = createPublicClient({
  batch: {
    multicall: {
      wait: 16,
    },
  },
  chain: hardhat,
  // transport: http(),
  // transport: webSocket(), // UrlRequiredError
  transport: webSocket("ws://127.0.0.1:8545"),
});

interface ChainMetadata {
  name: string;
  nativeCurrencySymbol: string;
}

export function getChainMetadata() {
  return {
    name: hardhat.name,
    nativeCurrencySymbol: hardhat.nativeCurrency.symbol,
  } as ChainMetadata;
}

const IS_BLOCK_NUMBER = /^[0-9]+$/;

export const isBlockNumber = (value: string) => IS_BLOCK_NUMBER.test(value);

export function isPrecompiled(address: Address): boolean {
  const value = BigInt(address);
  return value >= 1n && value <= 11n; // https://www.evm.codes/precompiled
}

export const formatAddress = (value: Address) =>
  value ? value.slice(0, 8) + "..." + value.slice(-6) : "";

export const formatHash = (value: Hash) =>
  value.slice(0, 10) + "..." + value.slice(-8);

export function toMessage(reason: unknown) {
  switch (true) {
    case reason instanceof BaseError:
      return reason.shortMessage;
    case reason instanceof Error:
      return reason.message;
    case typeof reason === "string":
      return reason;
    default:
      console.warn(reason);
      return JSON.stringify(reason);
  }
}
