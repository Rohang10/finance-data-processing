const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = require('./database');

async function runMigrations() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');

  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...');
    await client.query(sql);
    console.log('✅ Migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
