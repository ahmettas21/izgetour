import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit yapılandırması — SQLite (yerel better-sqlite3).
 * Schema tek doğruluk kaynağı: src/db/schema.ts
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/izgetour.db',
  },
});
