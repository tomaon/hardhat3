import type { TestClient } from "@nomicfoundation/hardhat-viem/types";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export async function createTestAccount(
  testClient: TestClient,
  balance: bigint,
) {
  const account = privateKeyToAccount(generatePrivateKey());

  await testClient.setBalance({
    address: account.address,
    value: balance,
  });

  return account;
}
