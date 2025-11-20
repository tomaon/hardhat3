# hardhat3

## [hardhat](https://hardhat.org/)

https://hardhat.org/docs/getting-started v3.0.14

## [Solidity](https://www.soliditylang.org/)

https://docs.soliditylang.org/en/v0.8.30

## [OpenZeppelin](https://docs.openzeppelin.com/contracts)

_TODO_

## EIP

- [ERC-20: Token Standard](https://eips.ethereum.org/EIPS/eip-20) 代替可能トークン
- [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712) 非代替性トークン
- [ERC-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721) 非代替性トークン = NFT
- [ERC-1155: Multi Token Standard](https://eips.ethereum.org/EIPS/eip-1155) 代替可能・非代替可能トークンを同時に扱う
- [ERC-3009: Transfer With Authorization](https://eips.ethereum.org/EIPS/eip-3009) 署名による転送認可

## Project Structure

```
hardhat3/
├── artifacts/              # hardhat build で作成
├── cache/                  # hardhat build で作成
├── contacts/
├── ignition/               # -> Hardhat Ignition
├── scripts/
├── tasks/
|   └── foo.ts
├── test/
├── .cspell.json
├── .gitignore
├── eslint.config.mjs
├── hardhat.config.ts
├── Makefile
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

```
hardhat3/
├── .dockerignore
├── Dockerfile                  # localhost
└── hardhat.config.docker.ts
```

```
hardhat3/
├── static/
|   ├── app.js
|   ├── favicon.ico
|   └── style.css
└── server.tsx
```

## @nomicfoundation/hardhat-toolbox-viem

- @nomicfoundation/hardhat-ignition
- @nomicfoundation/hardhat-ignition-viem
- @nomicfoundation/hardhat-keystore
- @nomicfoundation/hardhat-network-helpers
- @nomicfoundation/hardhat-node-test-runner
- @nomicfoundation/hardhat-verify
- @nomicfoundation/hardhat-viem
- @nomicfoundation/hardhat-viem-assertions
- @nomicfoundation/ignition-core

## env

_TODO_

.env を取り込む機能はない模様

```sh
# Hardhat Toolbox > hardhat-keystore
$ npx hardhat keystore set SEPOLIA_RPC_URL

👷🔐 Hardhat Production Keystore 🔐👷

This is the first time you are using the production keystore, please set a password.
The password must have at least 8 characters.

[hardhat-keystore] Enter the password:
```

## test

```sh
$ ./node_modules/.bin/hardhat test nodejs
No contracts to compile

Running node:test tests

  Counter
    ✔ Should emit the Increment event when calling the inc() function
    ✔ The sum of the Increment events should match the current value


  2 passing (825ms)
```

## scripts

### [send-op-tx.ts](./scripts/send-op-tx.ts)

```sh
$ ./node_modules/.bin/hardhat run scripts/send-op-tx.ts

Sending transaction using the OP chain type
Sending 1 wei from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 to itself
Estimated L1 gas: 1600n
Sending L2 transaction
Transaction sent successfully
```

## ignition

### [modules/Counter.ts](./ignition/modules/Counter.ts)

```sh
$ ./node_modules/.bin/hardhat ignition deploy ignition/modules/Counter.ts

You are running Hardhat Ignition against an in-process instance of Hardhat Network.
This will execute the deployment, but the results will be lost.
You can use --network <network-name> to deploy to a different network.

Hardhat Ignition 🚀

Deploying [ CounterModule ]

Batch #1
  Executed CounterModule#Counter

Batch #2
  Executed CounterModule#Counter.incBy

[ CounterModule ] successfully deployed 🚀

Deployed Addresses

CounterModule#Counter - 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## tasks

```sh
$ ./node_modules/.bin/hardhat foo
{} [
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
  '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
  '0x976ea74026e726554db657fa54763abd0c3a0aa9',
  '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
  '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
  '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
  '0xbcd4042de499d14e55001ccbb24a551f3b954096',
  '0x71be63f3384f5fb98995898a86b02fb2426c5788',
  '0xfabb0ac9d68b0b445fb7357272ff202c5651694a',
  '0x1cbd3b2770909d4e10f157cabc84c7264073c9ec',
  '0xdf3e18d64bc6a983f673ab319ccae4f1a57c7097',
  '0xcd3b766ccdd6ae721141f452c550ca635964ce71',
  '0x2546bcd3c84621e976d8185a91a922ae77ecec30',
  '0xbda5747bfd65f08deb54cb465eb87d40e51b197e',
  '0xdd2fd4581271e230360230f9337d5c0430bf44c0',
  '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
]
```

## memo

- watch
  - hono + Server-Side Events > vite/vue-ts + Worker > vite/vue-ts + SharedWorker
  - hone だと browser 側をどうするかが問題 = js + jsdoc はツラい
  - nuxt や next は派手すぎるし、hardhat 環境と共存できるかどうか…
  - vite/vue-ts + SharedWorker は初期表示が、さらに、重い
  - vite/vue-ts + Worker が一番マシ、と

- css
  - render を直接使うと &lt;style scoped /&gt; が適用されない、らしい
  - 使っていなくても上下のどこかにそれがあると崩れまくる
  - assets/globals.css のみなら問題ない

- test
  - @nomicfoundation/hardhat-viem-assertions を使うと確かに記述量は減るがわかりにくくなる、気がする
  - 公開されている関数も７つ で、依存を増やしてまで便利なのかどうか。。

  ```sh
      await viem.assertions.emitWithArgs(
      counter.write.inc!(),
      counter,
      "Increment",
      [1n],
    );
  ```

### [foundry-rs/forge-std](https://github.com/foundry-rs/forge-std)

- Solidity test に必要
- 最新は v1.11.0 (2025-10-08)
- サンプルでは github:foundry-rs/forge-std#v1.9.4 を指定
- [npm](https://www.npmjs.com/package/forge-std) の最新は 1.1.2 で **3 年** 更新されていない
- しかも v1.1.2 のブランチは github にはない
- 便利なんだろうが、使うには怖すぎる…
