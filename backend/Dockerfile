FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json ./
# No pnpm-lock.yaml in backend (monorepo lockfile is at repo root). Install from package.json.
RUN pnpm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma generate needs DATABASE_URL (schema validation); value unused for generate.
ENV DATABASE_URL="postgresql://localhost:5432/blog"
RUN pnpm prisma:generate
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["sh", "-c", "pnpm prisma:migrate && node dist/main.js"]
