const { validationResult } = require('express-validator');

// runs after the validation chain and short-circuits with a clear error
// if anything failed. keeps controllers clean.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validate };
