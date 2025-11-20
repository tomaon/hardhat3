import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("FooModule", (m) => {
  const account = m.getAccount(0);

  const foo = m.contract("Foo", [account, account]);

  return { foo };
});
