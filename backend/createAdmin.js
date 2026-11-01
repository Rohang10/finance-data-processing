require('dotenv').config();
const pool = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const adminEmail = 'admin@fincorp.com';
    const password = 'admin@573';

    // Check if exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existing.rows.length > 0) {
      console.log('Admin already exists! Email: admin@fincorp.com | Password is unknown (hash stored).');
      process.exit(0);
    }

    // Get admin role id
    const roleRow = await pool.query("SELECT id FROM roles WHERE name = 'admin'");
    if (roleRow.rows.length === 0) {
      console.log('Admin role does not exist in roles table!');
      process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)`,
      ['Super Admin', adminEmail, hashed, roleRow.rows[0].id]
    );

    console.log(`Successfully created! Email: ${adminEmail} | Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
