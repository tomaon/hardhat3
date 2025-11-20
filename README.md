# hardhat3

A sandbox project for exploring [Hardhat v3](https://hardhat.org/) with TypeScript, [Viem](https://viem.sh/), and [OpenZeppelin](https://docs.openzeppelin.com/contracts) contracts. Includes a minimal block explorer UI built with Vue 3.

## Prerequisites

- Node.js `^24`

## Installation

```sh
make install
```

## Usage

### Local node

```sh
make node
```

### Build contracts

```sh
make build
```

### Test

```sh
make test
```

### Coverage

```sh
make test && make coverage
```

> Requires `lcov`: `brew install lcov`

### UI (block explorer)

```sh
make dev
```

Open http://localhost:5173

### Deploy

```sh
make deploy-Counter
make deploy-Foo
```

### Run scripts

```sh
make run-foo
make run-send-op-tx
make run-x
```

### Custom task

```sh
npx hardhat foo
```

### Lint / Format

```sh
make lint
make format
```

## Project Structure

```
hardhat3/
├── contracts/
│   ├── Counter.sol          # simple counter with events
│   └── Foo.sol              # ERC-20 with AccessControl (mint / burn)
├── ignition/
│   └── modules/             # Hardhat Ignition deployment modules
├── scripts/                 # one-off scripts (viem wallet interactions)
├── tasks/                   # custom Hardhat tasks
├── tests/                   # node:test based tests
├── ui/                      # Vite + Vue 3 block explorer
│   └── app/
│       ├── views/RootView/  # blocks / transactions / address dialogs
│       └── workers/viem/    # Web Workers for chain subscriptions
├── hardhat.config.ts
├── vite.config.ts
└── Makefile
```

## Networks

| Name          | Type           | Chain |
|---------------|----------------|-------|
| `hardhatMainnet` | in-process  | L1    |
| `hardhatOp`   | in-process     | OP    |
| `localhost`   | http           | L1    |
| `sepolia`     | http           | L1    |

Sepolia requires `SEPOLIA_RPC_URL` and `SEPOLIA_PRIVATE_KEY` in the Hardhat keystore:

```sh
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

## License

[MIT](./LICENSE)
