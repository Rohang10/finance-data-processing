require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/api-docs\n`);
});
