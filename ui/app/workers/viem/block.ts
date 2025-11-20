import type { Transaction, WatchBlockNumberReturnType } from "viem";

import { publicClient, toMessage } from "../../utils/viem.ts";
import type { BlocksData, Input, Output } from "./index.ts";

async function toBlockData(blockNumber: bigint) {
  const block = await publicClient.getBlock({
    blockNumber,
    includeTransactions: true,
  });

  const transactions = block.transactions as Transaction[];

  return {
    number: block.number?.toString() ?? "?",
    timestamp: Number(block.timestamp) * 1000,
    miner: block.miner,
    transactionCount: transactions.length,
    contractCount: transactions.reduce((n, e) => (!e.to ? n + 1 : n), 0),
  };
}

function onBlockNumber(lastBlockNumber: bigint) {
  const queue: bigint[] = [];
  let processing = false;

  async function processQueue() {
    processing = true;
    try {
      while (queue.length > 0) {
        const blockNumber = queue.shift()!;

        // watchBlocks/watchBlockNumber 共に欠落する
        const blocks: bigint[] = [];
        for (let n = lastBlockNumber + 1n; n <= blockNumber; n++) {
          blocks.push(n);
        }

        const result = await Promise.all(blocks.map(toBlockData));
        lastBlockNumber = blockNumber;

        self.postMessage({
          kind: "t",
          result,
        } as Output<BlocksData>);
      }
    } finally {
      processing = false;
    }
  }

  // watchBlocks.onBlock は初回に 0 が飛んだが watchBlockNumber では飛ばず
  return function (
    blockNumber: bigint /*, prevBlockNumber: bigint | undefined */,
  ) {
    queue.push(blockNumber);
    if (!processing) {
      processQueue().catch(onError);
    }
  };
}

function onError(reason: unknown) {
  self.postMessage({
    kind: "f",
    message: toMessage(reason),
  } as Output<BlocksData>);
}

async function watch(abortController: AbortController) {
  const blockNumber = await publicClient.getBlockNumber();

  let unwatch: WatchBlockNumberReturnType | undefined;

  await new Promise((resolve, reject) => {
    unwatch = publicClient.watchBlockNumber({
      onBlockNumber: onBlockNumber(blockNumber),
      onError: reject,
    });

    abortController.signal.addEventListener("abort", () => {
      resolve(undefined);
    });
  })
    .catch(onError)
    .finally(() => {
      if (unwatch) {
        unwatch();
      }
      self.close();
    });
}

let abortController: AbortController | undefined;

self.addEventListener("message", (event: MessageEvent<Input>) => {
  const { cmd } = event.data;

  if (cmd === "stop") {
    if (abortController) {
      abortController.abort();
    }
    return;
  }

  if (cmd === "start") {
    if (!abortController) {
      abortController = new AbortController();
      watch(abortController);
    }
    return;
  }
});
