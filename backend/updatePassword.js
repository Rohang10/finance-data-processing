require('dotenv').config();
const pool = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  try {
    const adminEmail = 'admin@fincorp.com';
    const newPassword = 'admin@573'; // The password you wanted!

    const hashed = await bcrypt.hash(newPassword, 12);

    await pool.query(
      `UPDATE users SET password = $1 WHERE email = $2`,
      [hashed, adminEmail]
    );

    console.log(`✅ Password successfully updated for ${adminEmail} to: ${newPassword}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateAdminPassword();
