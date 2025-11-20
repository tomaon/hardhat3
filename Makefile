default: lint format

.PHONY: coverage test

#
install:
	@npm ci
outdated update:
	@npm $@
build test dev lint format:
	@npm run $@
node:
	rm -rf ignition/deployments
	@npm run $@

#
clean:
	@git clean -e .env -e tmp -dfx

# brew install lcov
coverage:
	@genhtml -o coverage/html coverage/lcov.info
	@open coverage/html/index.html

#
deploy-%:
	npx hardhat ignition deploy ignition/modules/$*.ts --network localhost
run-%:
	npx hardhat run scripts/$*.ts

#
bar:
	npx hardhat test nodejs tests/Bar.ts