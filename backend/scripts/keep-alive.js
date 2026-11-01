/**
 * Supabase Keep-Alive & Health Check Script
 * 
 * Runs a query against the PostgreSQL / Supabase database
 * to prevent Supabase free tier projects from auto-pausing (inactivity threshold: 7 days).
 * 
 * Usage:
 *   npm run keep-alive
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const pool = require('../src/config/database');

async function attemptPing(attemptNum, maxAttempts) {
  const startTime = Date.now();
  let client;
  try {
    client = await pool.connect();
    
    // Execute a query to register active activity in Supabase
    const result = await client.query(`
      SELECT 
        NOW() AS server_time,
        current_database() AS database_name,
        current_user AS user_name,
        version() AS pg_version;
    `);

    const latency = Date.now() - startTime;
    const row = result.rows[0];

    console.log(`\n======================================================`);
    console.log(`✅ Supabase Database is HEALTHY & ACTIVE`);
    console.log(`⏱️ Latency: ${latency}ms`);
    console.log(`🕒 Server Time: ${row.server_time}`);
    console.log(`🗄️ Database: ${row.database_name}`);
    console.log(`👤 Connected As: ${row.user_name}`);
    console.log(`======================================================\n`);

    // Log to local file
    try {
      const fs = require('fs');
      const logEntry = `[${new Date().toISOString()}] SUCCESS | Latency: ${latency}ms | DB: ${row.database_name} | User: ${row.user_name}\n`;
      fs.appendFileSync(path.join(__dirname, '../keep-alive.log'), logEntry);
    } catch (_) {}

    // Output to GitHub Actions Step Summary if available
    try {
      if (process.env.GITHUB_STEP_SUMMARY) {
        const fs = require('fs');
        const summary = [
          `## ⏱️ Supabase Database Keep-Alive Report`,
          ``,
          `| Property | Value |`,
          `| --- | --- |`,
          `| **Status** | ✅ HEALTHY & ACTIVE |`,
          `| **Latency** | ${latency}ms |`,
          `| **Server Time** | \`${row.server_time}\` |`,
          `| **Database** | \`${row.database_name}\` |`,
          `| **User** | \`${row.user_name}\` |`,
          `| **Host** | \`${process.env.DB_HOST || 'default'}\` |`,
          `| **Timestamp** | ${new Date().toISOString()} |`,
          ``,
          `> Supabase database connection verified and warmed up successfully.`
        ].join('\n');
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
      }
    } catch (_) {}

    return true;
  } catch (err) {
    console.error(`\n❌ Keep-alive attempt ${attemptNum}/${maxAttempts} failed: ${err.message}`);
    if (err.message.includes('tenant') || err.message.includes('not found')) {
      console.error(`⚠️ Notice: The Supabase project might be paused or deleted. Check your Supabase dashboard.`);
    }

    try {
      const fs = require('fs');
      const errEntry = `[${new Date().toISOString()}] ERROR (Attempt ${attemptNum}/${maxAttempts}): ${err.message}\n`;
      fs.appendFileSync(path.join(__dirname, '../keep-alive.log'), errEntry);
    } catch (_) {}

    if (attemptNum < maxAttempts) {
      console.log(`⏳ Waiting 3 seconds before retry...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return false;
    }

    // Output failure to GitHub Actions Step Summary if available
    try {
      if (process.env.GITHUB_STEP_SUMMARY) {
        const fs = require('fs');
        const errSummary = [
          `## ❌ Supabase Database Keep-Alive Failed`,
          ``,
          `> **Error:** ${err.message}`,
          ``,
          `Please check your Supabase dashboard to verify if the project is paused or if database credentials changed.`
        ].join('\n');
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, errSummary + '\n');
      }
    } catch (_) {}

    return false;
  } finally {
    if (client) client.release();
  }
}

async function checkDatabaseHealth() {
  console.log(`[${new Date().toISOString()}] 🔍 Running Supabase database keep-alive check...`);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const success = await attemptPing(attempt, maxAttempts);
    if (success) {
      await pool.end();
      return true;
    }
  }

  await pool.end();
  return false;
}

checkDatabaseHealth().then((healthy) => {
  process.exit(healthy ? 0 : 1);
});
