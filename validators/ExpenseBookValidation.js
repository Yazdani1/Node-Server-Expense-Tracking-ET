const { check } = require("express-validator");

/**
 * To validate expense book input field
 */

exports.validateExpenseBook = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("please add expense book name!"),
];
