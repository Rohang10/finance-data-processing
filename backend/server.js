require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8000;
const { startKeepAliveService } = require('./src/services/keepAliveService');

app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/api-docs\n`);

  // Start periodic keep-alive pings to Supabase
  const intervalHours = parseInt(process.env.DB_KEEP_ALIVE_HOURS) || 6;
  startKeepAliveService(intervalHours);
});
