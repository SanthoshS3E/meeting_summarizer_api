import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbInstance = null;

export async function initDB() {
  if (dbInstance) return dbInstance;

  const db = await open({
    filename: './server/database.sqlite',
    driver: sqlite3.Database
  });

  // ✅ Create users table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  // ✅ Create summaries table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT,               -- 'notes' or 'audio'
      original_text TEXT,
      summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  dbInstance = db;
  return dbInstance;
}
