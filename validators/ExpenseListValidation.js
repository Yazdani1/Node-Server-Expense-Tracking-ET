const { check } = require('express-validator');

/**
 * To validate expense list input field
 */

exports.validateExpenseList = [
  check('title').trim().not().isEmpty().withMessage('please add title!'),
  check('amount').trim().not().isEmpty().withMessage('please add amount!'),
  check('expense_category').trim().not().isEmpty().withMessage('please add expense category!'),
];
