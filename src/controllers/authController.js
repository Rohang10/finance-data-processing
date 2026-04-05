const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const pool = require('../config/database');
const { validate } = require('../middleware/validate');

// ─── Validation chains ─────────────────────────────────────────────────────

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer'])
    .withMessage('Role must be one of: admin, analyst, viewer'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = async (req, res) => {
  const { name, email, password, role = 'viewer' } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const roleRow = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleRow.rows.length === 0) {
      return res.status(400).json({ error: `Unknown role: ${role}` });
    }

    const hashed = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, status, created_at`,
      [name, email, hashed, roleRow.rows[0].id]
    );

    res.status(201).json({ message: 'Account created successfully.', user: rows[0] });
  } catch (err) {
    console.error('register failed:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.password, u.status, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
      [email]
    );

    // keep the error message vague on purpose — don't reveal whether email exists
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'This account has been deactivated.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('login failed:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

// just returns whatever authenticate already put on req.user
const getMe = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, registerValidation, login, loginValidation, getMe };
