import { HardhatRuntimeEnvironment } from "hardhat/types/hre";

interface FooTaskArguments {
  bar?: string;
}

export default async function (
  fooTaskArguments: FooTaskArguments,
  hre: HardhatRuntimeEnvironment,
) {
  const { provider } = await hre.network.connect();
  console.log(
    fooTaskArguments,
    await provider.request({ method: "eth_accounts" }),
  );
}
