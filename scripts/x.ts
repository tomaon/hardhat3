import { network } from "hardhat";
import { formatEther, parseEther } from "viem";

const { viem } = await network.connect({
  network: "localhost",
});

const publicClient = await viem.getPublicClient();
const [senderClient, receiverClient] = await viem.getWalletClients();

if (!senderClient || !receiverClient) {
  throw new Error("Wallet clients are not available");
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

{
  const hash = await senderClient.sendTransaction({
    to: receiverAddress,
    value: parseEther("1"),
    // gasLimit
    // maxFeePerGas
    // maxPriorityFeePerGas
  });
  console.log("\nsendTransaction:", hash);

  // baseFeePerGas <- block
  // effectiveGasPrice = min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)

  const r = await publicClient.waitForTransactionReceipt({ hash });
  console.log("gas:", formatEther(r.effectiveGasPrice * r.gasUsed));
}

{
  const x1 = await publicClient.getBalance({ address: senderAddress });
  console.log("\nSender Balance (ETH):", formatEther(x1));

  const x3 = await publicClient.getBalance({ address: receiverAddress });
  console.log("Receiver Balance (ETH):", formatEther(x3));
}
