/**
 * In-App Supabase Database Keep-Alive Service
 *
 * Periodically pings the database every X hours (default: 6 hours)
 * to keep the connection warm and prevent Supabase free tier projects from pausing.
 */

const pool = require('../config/database');

let timer = null;

async function pingDatabase() {
  const startTime = Date.now();
  try {
    const res = await pool.query('SELECT NOW() AS ping_time');
    const latency = Date.now() - startTime;
    console.log(`[Keep-Alive] 💓 Supabase ping successful (${latency}ms) at ${res.rows[0].ping_time.toISOString()}`);
    return true;
  } catch (err) {
    console.error(`[Keep-Alive] ⚠️ Supabase ping failed:`, err.message);
    return false;
  }
}

function startKeepAliveService(intervalHours = 6) {
  if (timer) {
    clearInterval(timer);
  }

  const intervalMs = Math.max(intervalHours, 1) * 60 * 60 * 1000;
  console.log(`[Keep-Alive] ⏱️ Service started. Pinging Supabase every ${intervalHours} hours.`);

  // Initial ping 10 seconds after server start
  setTimeout(() => {
    pingDatabase();
  }, 10000);

  // Scheduled interval ping
  timer = setInterval(() => {
    pingDatabase();
  }, intervalMs);

  // Unref so it won't block graceful shutdown
  if (timer.unref) {
    timer.unref();
  }
}

function stopKeepAliveService() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    console.log('[Keep-Alive] 🛑 Service stopped.');
  }
}

module.exports = {
  pingDatabase,
  startKeepAliveService,
  stopKeepAliveService,
};
