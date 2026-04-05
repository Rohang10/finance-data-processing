const pool = require('../config/database');

const getSummary = async (req, res) => {
  const { startDate, endDate } = req.query;
  const conditions = ['deleted_at IS NULL'];
  const values = [];

  if (startDate) { values.push(startDate); conditions.push(`date >= $${values.length}`); }
  if (endDate)   { values.push(endDate);   conditions.push(`date <= $${values.length}`); }

  const where = `WHERE ${conditions.join(' AND ')}`;

  try {
    const { rows } = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
         COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net_balance,
         COUNT(*) AS total_records
       FROM financial_records
       ${where}`,
      values
    );

    res.json({ data: rows[0] });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Failed to load summary.' });
  }
};

const getByCategory = async (req, res) => {
  const { startDate, endDate, type } = req.query;
  const conditions = ['deleted_at IS NULL'];
  const values = [];

  if (type)      { values.push(type);      conditions.push(`type = $${values.length}`); }
  if (startDate) { values.push(startDate); conditions.push(`date >= $${values.length}`); }
  if (endDate)   { values.push(endDate);   conditions.push(`date <= $${values.length}`); }

  const where = `WHERE ${conditions.join(' AND ')}`;

  try {
    const { rows } = await pool.query(
      `SELECT
         category,
         type,
         COALESCE(SUM(amount), 0) AS total,
         COUNT(*) AS count
       FROM financial_records
       ${where}
       GROUP BY category, type
       ORDER BY total DESC`,
      values
    );

    res.json({ data: rows });
  } catch (err) {
    console.error('getByCategory error:', err);
    res.status(500).json({ error: 'Failed to load category breakdown.' });
  }
};

const getMonthlyTrend = async (req, res) => {
  const { startDate, endDate } = req.query;

  // default to last 12 months if no range is given
  const start = startDate || new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    .toISOString().split('T')[0];
  const end = endDate || new Date().toISOString().split('T')[0];

  try {
    const { rows } = await pool.query(
      `SELECT
         TO_CHAR(date, 'YYYY-MM') AS month,
         COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
         COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net
       FROM financial_records
       WHERE deleted_at IS NULL AND date >= $1 AND date <= $2
       GROUP BY month
       ORDER BY month ASC`,
      [start, end]
    );

    res.json({ data: rows });
  } catch (err) {
    console.error('getMonthlyTrend error:', err);
    res.status(500).json({ error: 'Failed to load monthly trend.' });
  }
};

const getWeeklyTrend = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('week', date), 'YYYY-MM-DD') AS week_start,
         COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
         COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net
       FROM financial_records
       WHERE deleted_at IS NULL
         AND date >= (CURRENT_DATE - INTERVAL '8 weeks')
       GROUP BY week_start
       ORDER BY week_start ASC`
    );

    res.json({ data: rows });
  } catch (err) {
    console.error('getWeeklyTrend error:', err);
    res.status(500).json({ error: 'Failed to load weekly trend.' });
  }
};

const getRecentActivity = async (req, res) => {
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.amount, r.type, r.category, r.date, r.notes,
              r.created_at, u.name AS created_by
       FROM financial_records r
       JOIN users u ON u.id = r.created_by
       WHERE r.deleted_at IS NULL
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ data: rows });
  } catch (err) {
    console.error('getRecentActivity error:', err);
    res.status(500).json({ error: 'Failed to load recent activity.' });
  }
};

module.exports = { getSummary, getByCategory, getMonthlyTrend, getWeeklyTrend, getRecentActivity };
