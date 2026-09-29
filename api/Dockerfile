FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 9000

CMD ["bun", "./src/main.ts"]
