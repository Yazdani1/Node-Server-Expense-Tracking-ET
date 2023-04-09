const { check } = require("express-validator");

/**
 * To validate expense category input field
 */

exports.validateExpenseCategory = [
  check("category_name").trim().not().isEmpty().withMessage("please add category name!"),
  check("expense_book_id").trim().not().isEmpty().withMessage("please add expensebook id!"),
];
