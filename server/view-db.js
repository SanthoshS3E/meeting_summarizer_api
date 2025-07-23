
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPath = './server/database.sqlite'; // ✅ same path used in initDB()

async function viewSummaries() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log("✅ Tables:", await db.all(`SELECT name FROM sqlite_master WHERE type='table'`));

  const rows = await db.all(`SELECT * FROM summaries`);
  console.log("✅ Summaries in DB:", rows);
}

viewSummaries();
