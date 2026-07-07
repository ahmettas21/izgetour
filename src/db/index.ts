/**
 * İzgeTour — SQLite/Drizzle bağlantı katmanı (getDb singleton).
 *
 * Kararlara uyum:
 *  - PRAGMA journal_mode=WAL   → okuyucu (site) yazıcıyı (worker) bloklamaz
 *  - PRAGMA foreign_keys=ON    → SQLite'ta FK default kapalı, açıyoruz
 *  - PRAGMA busy_timeout=5000  → kilit varsa "database is locked" yerine bekle
 *
 * DB erişimi burada soyutlanır; ileride Postgres/Turso geçişi tek dosya değişikliği.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

type DrizzleDb = BetterSQLite3Database<typeof schema>;

// Global singleton — Next dev hot-reload'da bağlantının çoğalmasını önler.
const globalForDb = globalThis as unknown as {
  __izgetourDb?: DrizzleDb;
  __izgetourSqlite?: Database.Database;
};

function resolveDbPath(): string {
  const raw = process.env.DATABASE_PATH || './data/izgetour.db';
  return resolve(process.cwd(), raw);
}

function createDb(): DrizzleDb {
  const dbPath = resolveDbPath();

  // data/ (veya özel dizin) yoksa oluştur
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);

  // Zorunlu PRAGMA'lar
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('busy_timeout = 5000');

  globalForDb.__izgetourSqlite = sqlite;

  return drizzle(sqlite, { schema });
}

/**
 * Uygulama genelinde tek Drizzle bağlantısı döndürür.
 */
export function getDb(): DrizzleDb {
  if (!globalForDb.__izgetourDb) {
    globalForDb.__izgetourDb = createDb();
  }
  return globalForDb.__izgetourDb;
}

/**
 * Alt seviye better-sqlite3 örneğini döndürür (PRAGMA/migration/kapatma için).
 */
export function getRawSqlite(): Database.Database {
  getDb(); // bağlantının kurulduğundan emin ol
  return globalForDb.__izgetourSqlite!;
}

export { schema };
