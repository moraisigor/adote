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

EXPOSE 9999

HEALTHCHECK --start-period=10s --retries=2 --timeout=5s --interval=50s \
  CMD ["bun", "-e", "fetch(`http://localhost:${process.env.PORT ?? 9999}/api/health`).then(({ ok: success }) => process.exit(Number(success)), () => process.exit(1))"]

CMD ["bun", "./src/main.ts"]
