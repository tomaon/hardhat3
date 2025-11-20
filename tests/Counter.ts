import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

/*
╔═══════════════════════════════════════════════════════════════════════╗
║                         Gas Usage Statistics                          ║
╚═══════════════════════════════════════════════════════════════════════╝
╔═══════════════════════════════════════════════════════════════════════╗
║ contracts/Counter.sol:Counter                                         ║
╟─────────────────┬─────────────────┬─────────┬────────┬───────┬────────╢
║ Function name   │ Min             │ Average │ Median │ Max   │ #calls ║
╟─────────────────┼─────────────────┼─────────┼────────┼───────┼────────╢
║ inc             │ 30893           │ 39443   │ 39443  │ 47993 │ 4      ║
║ incBy           │ 48131           │ 48131   │ 48131  │ 48131 │ 1      ║
║ x               │ 23466           │ 23466   │ 23466  │ 23466 │ 8      ║
╟─────────────────┼─────────────────┼─────────┴────────┴───────┴────────╢
║ Deployment Cost │ Deployment Size │                                   ║
╟─────────────────┼─────────────────┤                                   ║
║ 231675          │ 1184            │                                   ║
╚═════════════════╧═════════════════╧═══════════════════════════════════╝
*/

describe("Counter", { concurrency: true }, async function () {
  const { viem } = await network.connect();

  const deployContract = (init: bigint) =>
    viem.deployContract("Counter", [init]);

  const publicClient = await viem.getPublicClient();

  async function createContractEventFilter(
    contract: Awaited<ReturnType<typeof deployContract>>,
  ) {
    const filter = await publicClient.createContractEventFilter({
      abi: contract.abi, // ここで args の型情報が欠落するらしい。json.abi を渡せば解決できるが…
      address: contract.address,
      eventName: "Increment", // その状態でこれがあると args:never になる
      strict: true,
    });

    return Object.assign(filter, {
      async [Symbol.asyncDispose]() {
        await publicClient.uninstallFilter({ filter });
      },
    });
  }

  async function getFilterChanges(
    filter: Awaited<ReturnType<typeof createContractEventFilter>>,
  ) {
    const logs = await publicClient.getFilterChanges({ filter });
    return {
      length: BigInt(logs.length),
      sum: logs.reduce((a, e) => a + (e.args as { by: bigint }).by, 0n), // で、仕方なく、cast
    };
  }

  it("inc() increments by 1", async function () {
    const init = 0n;
    const contract = await deployContract(init);
    await using filter = await createContractEventFilter(contract);

    assert.strictEqual(await contract.read.x!(), init);

    const hash = await contract.write.inc!();
    await publicClient.waitForTransactionReceipt({ hash });

    assert.strictEqual(await contract.read.x!(), init + 1n);

    const { length, sum } = await getFilterChanges(filter);
    assert.strictEqual(length, 1n);
    assert.strictEqual(sum, 1n);
  });

  it("Multiple inc() calls accumulate", async function () {
    const init = 0n;
    const contract = await deployContract(init);
    await using filter = await createContractEventFilter(contract);

    assert.strictEqual(await contract.read.x!(), init);

    const n = 3n;
    for (let i = 1n; i <= n; i++) {
      const hash = await contract.write.inc!();
      await publicClient.waitForTransactionReceipt({ hash });
    }

    assert.strictEqual(await contract.read.x!(), init + n);

    const { length, sum } = await getFilterChanges(filter);
    assert.strictEqual(length, n);
    assert.strictEqual(sum, n);
  });

  it("incBy(-1) fails with IntegerOutOfRangeError", async function () {
    const init = 0n;
    const contract = await deployContract(init);
    await using filter = await createContractEventFilter(contract);

    assert.strictEqual(await contract.read.x!(), init);

    await assert.rejects(contract.write.incBy!([-1n]), (error: Error) => {
      return (
        error.name === "IntegerOutOfRangeError" &&
        error.message.includes("not in safe 256-bit unsigned integer range")
      );
    });

    assert.strictEqual(await contract.read.x!(), init);

    const { length } = await getFilterChanges(filter);
    assert.strictEqual(length, 0n);
  });

  // it("incBy(1) reverts with InvalidIncrement", async function () {
  //   const init = 0n;
  //   const contract = await deployContract(init);
  //   await using filter = await createContractEventFilter(contract);

  //   assert.strictEqual(await contract.read.x!(), init);

  //   await assert.rejects(contract.write.incBy!([1n]), (error: Error) => {
  //     return (
  //       error.name === "ContractFunctionExecutionError" &&
  //       error.message.includes("InvalidIncrement(1)")
  //     );
  //   });

  //   assert.strictEqual(await contract.read.x!(), init);

  //   const { length } = await getFilterChanges(filter);
  //   assert.strictEqual(length, 0n);
  // });

  it("incBy(n) increments by n", async function () {
    const init = 0n;
    const contract = await deployContract(init);
    await using filter = await createContractEventFilter(contract);

    assert.strictEqual(await contract.read.x!(), init);

    const n = 5n;
    const hash = await contract.write.incBy!([n]);
    await publicClient.waitForTransactionReceipt({ hash });

    assert.strictEqual(await contract.read.x!(), init + n);

    const { length, sum } = await getFilterChanges(filter);
    assert.strictEqual(length, 1n);
    assert.strictEqual(sum, n);
  });
});
