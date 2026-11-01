const bcrypt = require('bcryptjs');
const { body, param } = require('express-validator');
const pool = require('../config/database');

const createUserValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password needs to be at least 6 characters'),
  body('role')
    .isIn(['admin', 'analyst', 'viewer'])
    .withMessage('Role must be admin, analyst, or viewer'),
];

const updateUserValidation = [
  param('id').isUUID().withMessage('Invalid user ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be blank'),
  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer'])
    .withMessage('Role must be admin, analyst, or viewer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

const getAllUsers = async (req, res) => {
  const { status, role, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`u.status = $${values.length}`);
  }
  if (role) {
    values.push(role);
    conditions.push(`r.name = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM users u JOIN roles r ON r.id = u.role_id ${where}`,
      values
    );
    const total = parseInt(countRes.rows[0].count);

    values.push(parseInt(limit), offset);
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.status, r.name AS role, u.created_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       ${where}
       ORDER BY u.created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    res.json({
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.status, r.name AS role, u.created_at, u.updated_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ data: rows[0] });
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const roleRow = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleRow.rows.length === 0) {
      return res.status(400).json({ error: `Role "${role}" not found.` });
    }

    const hashed = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, status, created_at`,
      [name, email, hashed, roleRow.rows[0].id]
    );

    res.status(201).json({ message: 'User created.', data: rows[0] });
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role, status } = req.body;

  // don't let an admin accidentally lock themselves out
  if (req.user.id === id && status === 'inactive') {
    return res.status(400).json({ error: 'You cannot deactivate your own account.' });
  }

  const updates = [];
  const values = [];

  if (name) {
    values.push(name);
    updates.push(`name = $${values.length}`);
  }
  if (status) {
    values.push(status);
    updates.push(`status = $${values.length}`);
  }
  if (role) {
    const roleRow = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleRow.rows.length === 0) {
      return res.status(400).json({ error: `Role "${role}" not found.` });
    }
    values.push(roleRow.rows[0].id);
    updates.push(`role_id = $${values.length}`);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  try {
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE id = $${values.length}
       RETURNING id, name, email, status, updated_at`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User updated.', data: rows[0] });
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.id === id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    const { rows } = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User removed.', data: rows[0] });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  createUserValidation,
  updateUser,
  updateUserValidation,
  deleteUser,
};
