require('dotenv').config();
const pool = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Seeding test users...');
  try {
    const hashedPass = await bcrypt.hash('Password123!', 12);
    
    // Get role IDs
    const roles = await pool.query('SELECT name, id FROM roles');
    const roleMap = {};
    roles.rows.forEach(r => roleMap[r.name] = r.id);

    const users = [
      { name: 'Admin User', email: 'admin@test.com', role: roleMap['admin'] },
      { name: 'Analyst User', email: 'analyst@test.com', role: roleMap['analyst'] },
      { name: 'Viewer User', email: 'viewer@test.com', role: roleMap['viewer'] }
    ];

    for (const u of users) {
      await pool.query(
        'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
        [u.name, u.email, hashedPass, u.role]
      );
      console.log(`✅ User ${u.email} created.`);
    }

    console.log('\n🚀 ALL ROLES SEEDED SUCCESSFULLY FOR TESTING!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
