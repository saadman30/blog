#
# Simple, modern multi-stage Dockerfile for the frontend (Next.js + json-server).
# Uses the latest Node 22 Alpine image and pnpm via Corepack.
#

FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via Corepack (bundled with modern Node)
RUN corepack enable

# Install dependencies
COPY package.json ./
RUN pnpm install

# Build the app
COPY . .
RUN pnpm build

#
# Production runtime image
#
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy built assets and runtime dependencies
# (No /public directory in this project, so we only copy .next, deps, and config.)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/mock ./mock

# Ensure a public directory exists so json-server's static file handling
# doesn't crash with ENOENT when scanning /app/public.
RUN mkdir -p public

# Ports:
# - 3000: Next.js app
# - 4000: json-server mock API
EXPOSE 3000 4000

# Run json-server and Next.js in the same container
CMD ["sh", "-c", "npx json-server --watch mock/db.json --port 4000 --host 0.0.0.0 & node node_modules/next/dist/bin/next start -p 3000 -H 0.0.0.0"]

