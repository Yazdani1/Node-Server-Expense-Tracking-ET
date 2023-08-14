const { validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.status(422).json({ error: error });
};
