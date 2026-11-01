const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing.' });
  }

  // extract the token — case-insensitive match for "Bearer"
  let token = authHeader;
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.substring(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // pull the latest status and role from the DB.
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.status, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'This account no longer exists.' });
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Your account is deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    // console log for troubleshooting in terminal
    console.error('Auth Error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Permission denied. Required role: ${allowedRoles.join(' or ')}.`
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
