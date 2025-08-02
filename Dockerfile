FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

CMD sh -c "npx drizzle-kit push --config=drizzle.config.ts && node dist/src/main"