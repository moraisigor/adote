FROM oven/bun:1.4.0 AS install

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

FROM oven/bun:1.4.0-slim

WORKDIR /app

COPY --from=install --chown=bun:bun /app/node_modules ./node_modules
COPY --chown=bun:bun package.json tsconfig.json ./
COPY --chown=bun:bun src ./src

USER bun

EXPOSE 9000

CMD ["bun", "./src/main.ts"]
