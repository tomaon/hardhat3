import { network } from "hardhat";
import { formatEther, getContract } from "viem";

import abi from "../artifacts/contracts/Foo.sol/Foo.json" with { type: "json" };

// Foo = ERC20
//
// 0. contract をデプロイした人=deployer が、最初の所有者 (owner)
//    初期供給量もデプロイ時にきまる = mint | burn を *作れば* 供給量の増減は可能
// 1. transfer(receiver, amount)
//   owner が自分の残高から receiver に対して amount 分のトークンを送る関数
// 2. allowance(owner, spender)
//   owner が spender に対して許可した残高を確認する関数
// 3. approve(spender, amount)
//   owner が spender に対して、最大で amount 分のトークンを使っていい、と許可を与える関数。
// 4. transferFrom(owner, receiver, amount)
//   spender が owner の許可を得て、owner の残高から receiver に対して amount 分のトークンを送る関数。

// Sender Address: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
// Receiver Address: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
//
// Sender Balance (ETH): 9999.998680167087429226
// Receiver Balance (ETH): 10000
//
// Token Name: Foo
// Token Symbol: ETK
// Decimals: 18
// Total Supply: 10n
//
// Sender Balance (ETH): 9999.998680167087429226
// Sender Balance (ETK): 5n
// Receiver Balance (ETH): 10000
// Receiver Balance (ETK): 5n
//
// transfer: 0x32faf1fb1ef9953f36aaabcef63f58a62ce8b670daf6067c0442c8d622d22232
// gas: 0.00004807677356257      <<<< ¥476481.42/ETH * 0.00004807677356257 = ¥22.90768933611181244
//
// Sender Balance (ETH): 9999.998632090313866656
// Sender Balance (ETK): 4n
// Receiver Balance (ETH): 10000
// Receiver Balance (ETK): 6n

// make node

const { viem } = await network.connect({
  network: "localhost",
});

const publicClient = await viem.getPublicClient();

const [senderClient, receiverClient] = await viem.getWalletClients();

if (!senderClient || !receiverClient) {
  throw new Error("No wallet client available");
}

const senderAddress = senderClient.account.address;
console.log("Sender Address:", senderAddress);

const receiverAddress = receiverClient.account.address;
console.log("Receiver Address:", receiverAddress);

{
  const x1 = await publicClient.getBalance({ address: senderAddress });
  console.log("\nSender Balance (ETH):", formatEther(x1));

  const x3 = await publicClient.getBalance({ address: receiverAddress });
  console.log("Receiver Balance (ETH):", formatEther(x3));
}

// make deploy-Foo

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;

const contract = getContract({
  address: contractAddress,
  abi: abi.abi,
  client: { public: publicClient, wallet: senderClient },
});

{
  // const name = await publicClient.readContract({
  //     address: contractAddress,
  //     abi: abi.abi,
  //     functionName: "name",
  // });

  const name = await contract.read.name!();
  const symbol = await contract.read.symbol!();
  const decimals = await contract.read.decimals!();
  const totalSupply = await contract.read.totalSupply!();

  console.log("\nToken Name:", name);
  console.log("Token Symbol:", symbol);
  console.log("Decimals:", decimals);
  console.log("Total Supply:", totalSupply);
}

{
  await contract.write.mint!([senderAddress, 10n]);
  console.log("\nmint:", await contract.read.totalSupply!());
}

{
  const x11 = await publicClient.getBalance({ address: senderAddress });
  console.log("\nSender Balance (ETH):", formatEther(x11));

  const x12 = (await contract.read.balanceOf!([senderAddress])) as bigint;
  console.log("Sender Balance (ETK):", x12);

  const x13 = await publicClient.getBalance({ address: receiverAddress });
  console.log("Receiver Balance (ETH):", formatEther(x13));

  const x14 = (await contract.read.balanceOf!([receiverAddress])) as bigint;
  console.log("Receiver Balance (ETK):", x14);

  const v = 1n;

  if (x12 >= v) {
    const hash = await contract.write.transfer!([receiverAddress, v]);
    console.log("\ntransfer:", hash);

    const r = await publicClient.waitForTransactionReceipt({ hash });
    console.log("gas:", formatEther(r.effectiveGasPrice * r.gasUsed));

    const x21 = await publicClient.getBalance({ address: senderAddress });
    console.log("\nSender Balance (ETH):", formatEther(x21));

    const x22 = (await contract.read.balanceOf!([senderAddress])) as bigint;
    console.log("Sender Balance (ETK):", x22);

    const x23 = await publicClient.getBalance({ address: receiverAddress });
    console.log("Receiver Balance (ETH):", formatEther(x23));

    const x24 = (await contract.read.balanceOf!([receiverAddress])) as bigint;
    console.log("Receiver Balance (ETK):", x24);
  } else {
    console.log("\nNot enough ETK balance to transfer");
  }
}
