import {
  type Hash,
  type WatchPendingTransactionsReturnType,
  formatEther,
} from "viem";

import { publicClient, toMessage } from "../../utils/viem.ts";
import type { Input, Output, TransactionsData } from "./index.ts";

async function toTransactionData(hash: Hash) {
  const transaction = await publicClient.getTransaction({ hash });

  return {
    hash,
    timestamp: Date.now(),
    from: transaction.from,
    to: transaction.to,
    value: formatEther(transaction.value),
  };
}

function onTransactions() {
  const queue: Hash[][] = [];
  let processing = false;

  async function processQueue() {
    processing = true;
    try {
      while (queue.length > 0) {
        const transactions = queue.shift()!;
        self.postMessage({
          kind: "t",
          result: await Promise.all(transactions.map(toTransactionData)),
        } as Output<TransactionsData>);
      }
    } finally {
      processing = false;
    }
  }

  return function (transactions: Hash[]) {
    queue.push(transactions);
    if (!processing) {
      processQueue().catch(onError);
    }
  };
}

function onError(reason: unknown) {
  self.postMessage({
    kind: "f",
    message: toMessage(reason),
  } as Output<TransactionsData>);
}

async function watch(abortController: AbortController) {
  let unwatch: WatchPendingTransactionsReturnType | undefined;

  await new Promise((resolve, reject) => {
    unwatch = publicClient.watchPendingTransactions({
      onTransactions: onTransactions(),
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
