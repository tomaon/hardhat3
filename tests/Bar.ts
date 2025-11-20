import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

import { createTestAccount } from "./helpers.ts";

describe("Bar", { concurrency: true }, async function () {
  const { viem } = await network.connect();

  const publicClient = await viem.getPublicClient();
  const testClient = await viem.getTestClient();

  it("test 1: balance transfer", async function () {
    const init = 123n;
    const account = await createTestAccount(testClient, init);

    const [balance, transactionCount] = await Promise.all([
      publicClient.getBalance({ address: account.address }),
      publicClient.getTransactionCount({ address: account.address }),
    ]);

    assert.strictEqual(balance, init);
    assert.strictEqual(transactionCount, 0);
  });
});
