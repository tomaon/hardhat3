# syntax=docker/dockerfile:1

#
FROM public.ecr.aws/docker/library/node:24-trixie-slim AS build

WORKDIR /app

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm i hardhat

RUN npm pkg set type=module

COPY ./hardhat.config.docker.ts ./hardhat.config.ts

#
FROM gcr.io/distroless/nodejs24-debian12 AS runtime

USER nonroot

WORKDIR /app

COPY --from=build /app/hardhat.config.ts ./hardhat.config.ts
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules/ ./node_modules/

EXPOSE 8545

CMD ["./node_modules/.bin/hardhat", "node", "--hostname", "0.0.0.0"]
