const { body, param } = require('express-validator');
const pool = require('../config/database');

const createRecordValidation = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

const updateRecordValidation = [
  param('id').isUUID().withMessage('Invalid record ID'),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be blank'),
  body('date').optional().isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  body('notes').optional().isString(),
];

const getAllRecords = async (req, res) => {
  const { type, category, startDate, endDate, page = 1, limit = 20, search } = req.query;

  // clamp pagination to sane values
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = ['r.deleted_at IS NULL'];
  const values = [];

  if (type) {
    values.push(type);
    conditions.push(`r.type = $${values.length}`);
  }
  if (category) {
    values.push(`%${category}%`);
    conditions.push(`r.category ILIKE $${values.length}`);
  }
  if (startDate) {
    values.push(startDate);
    conditions.push(`r.date >= $${values.length}`);
  }
  if (endDate) {
    values.push(endDate);
    conditions.push(`r.date <= $${values.length}`);
  }
  if (search) {
    values.push(`%${search}%`);
    // search across category and notes
    conditions.push(`(r.category ILIKE $${values.length} OR r.notes ILIKE $${values.length})`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  try {
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM financial_records r ${where}`,
      values
    );
    const total = parseInt(countRes.rows[0].count);

    values.push(limitNum, offset);
    const { rows } = await pool.query(
      `SELECT r.id, r.amount, r.type, r.category, r.date, r.notes,
              r.created_at, r.updated_at,
              u.name AS created_by
       FROM financial_records r
       JOIN users u ON u.id = r.created_by
       ${where}
       ORDER BY r.date DESC, r.created_at DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    res.json({
      data: rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('getAllRecords error:', err);
    res.status(500).json({ error: 'Failed to fetch records.' });
  }
};

const getRecordById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.amount, r.type, r.category, r.date, r.notes,
              r.created_at, r.updated_at,
              u.name AS created_by
       FROM financial_records r
       JOIN users u ON u.id = r.created_by
       WHERE r.id = $1 AND r.deleted_at IS NULL`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json({ data: rows[0] });
  } catch (err) {
    console.error('getRecordById error:', err);
    res.status(500).json({ error: 'Failed to fetch record.' });
  }
};

const createRecord = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO financial_records (amount, type, category, date, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, amount, type, category, date, notes, created_at`,
      [amount, type, category, date, notes || null, req.user.id]
    );

    res.status(201).json({ message: 'Record created.', data: rows[0] });
  } catch (err) {
    console.error('createRecord error:', err);
    res.status(500).json({ error: 'Failed to create record.' });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  const updates = [];
  const values = [];

  if (amount !== undefined) { values.push(amount);    updates.push(`amount = $${values.length}`); }
  if (type)                 { values.push(type);      updates.push(`type = $${values.length}`); }
  if (category)             { values.push(category);  updates.push(`category = $${values.length}`); }
  if (date)                 { values.push(date);      updates.push(`date = $${values.length}`); }
  if (notes !== undefined)  { values.push(notes);     updates.push(`notes = $${values.length}`); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  updates.push('updated_at = NOW()');
  values.push(id);

  try {
    const { rows } = await pool.query(
      `UPDATE financial_records
       SET ${updates.join(', ')}
       WHERE id = $${values.length} AND deleted_at IS NULL
       RETURNING id, amount, type, category, date, notes, updated_at`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json({ message: 'Record updated.', data: rows[0] });
  } catch (err) {
    console.error('updateRecord error:', err);
    res.status(500).json({ error: 'Failed to update record.' });
  }
};

// soft delete — financial records should never be hard-deleted
const deleteRecord = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE financial_records
       SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, category, type, amount`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json({ message: 'Record deleted.', data: rows[0] });
  } catch (err) {
    console.error('deleteRecord error:', err);
    res.status(500).json({ error: 'Failed to delete record.' });
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  createRecordValidation,
  updateRecord,
  updateRecordValidation,
  deleteRecord,
};
