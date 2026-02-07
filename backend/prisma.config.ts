import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Fallback for `prisma generate` when DATABASE_URL is not set (e.g. CI/Docker build)
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/blog',
  },
});
