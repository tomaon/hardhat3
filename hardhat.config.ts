// import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";

// import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";
import hardhatIgnition from "@nomicfoundation/hardhat-ignition";
import hardhatNodeTestRunner from "@nomicfoundation/hardhat-node-test-runner";
import hardhatViem from "@nomicfoundation/hardhat-viem";
// import hardhatViemAssertions from "@nomicfoundation/hardhat-viem-assertions";
// import hardhatVerifyPlugin from "@nomicfoundation/hardhat-verify"

import { configVariable, defineConfig, task } from "hardhat/config";

const foo = task("foo", "task: foo")
  .setAction(() => import("./tasks/foo.ts"))
  .build();

export default defineConfig({
  paths:{
    "tests":"./tests"
  },
  plugins: [
    // hardhatToolboxViemPlugin,
    hardhatIgnition,
    hardhatViem,
    // hardhatViemAssertions,
    hardhatNodeTestRunner,
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op", // OP stack
    },
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
  // verify: {
  // },
  tasks: [foo],
});
