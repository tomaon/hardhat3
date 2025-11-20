import { defineConfig } from "hardhat/config";

export default defineConfig({
  networks: {
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://0.0.0.0:8545",
    },
  },
});
