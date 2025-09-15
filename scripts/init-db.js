#!/usr/bin/env node
/*
  Ensures the PostgreSQL database from DATABASE_URL exists.
  - Parses process.env.DATABASE_URL
  - Connects to the default "postgres" database
  - Creates the target database if it doesn't exist

  Notes:
  - Requires the Postgres role in the URL to have permission to create DBs
  - If the DB already exists, this script is a no-op
*/

const { URL } = require('url');
const { Client } = require('pg');
require('dotenv').config({ path: require('path').join(process.cwd(), '.env') });

async function ensureDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Aborting DB creation.');
    process.exit(1);
  }

  const parsed = new URL(databaseUrl);
  const targetDb = parsed.pathname.replace(/^\//, '');

  // connect to default postgres database
  const adminUrl = new URL(databaseUrl);
  adminUrl.pathname = '/postgres';

  const client = new Client({ connectionString: adminUrl.toString() });

  try {
    await client.connect();

    // Check if DB exists
    const existsRes = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDb]
    );

    if (existsRes.rowCount > 0) {
      console.log(`Database "${targetDb}" already exists.`);
      return;
    }

    // Create DB
    console.log(`Creating database "${targetDb}"...`);
    await client.query(`CREATE DATABASE "${targetDb}"`);
    console.log(`Database "${targetDb}" created.`);
  } catch (err) {
    console.error('Failed to ensure database exists:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

ensureDatabase();
