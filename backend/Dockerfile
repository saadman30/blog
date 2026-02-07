FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS builder
RUN apk add --no-cache libc6-compat
# Copy package manifest first for better layer caching.
COPY package.json ./
# Install deps in builder so pnpm layout is valid (copying node_modules between stages breaks it).
# Skip postinstall (prisma generate) until schema is present.
RUN pnpm install --ignore-scripts
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
COPY --from=builder /app/prisma.config.ts ./
EXPOSE 4000
CMD ["sh", "-c", "pnpm prisma:migrate && node dist/src/main.js"]
